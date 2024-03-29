const regex = require('../utils/regex')
const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status')
const Image = require('../models/image')
const User = require('../models/user')
const UserFollow = require('../models/userFollow')
const { decryptAES256, encryptSHA256 } = require('../utils/encryption')
const commonService = require('../services/common')
const env = process.env.NODE_ENV || 'local'
const config = require('../config/config.json')[env]
const { v4: uuidv4 } = require('uuid')
const sizeOf = require('image-size')
const fs = require('fs')
const imageService = require('../services/image')
const { Op } = require('sequelize')
const { UserSearchLog, sequelize } = require('../models')
const Sequelize = require('sequelize')
const postService = require('../services/post')
const { dateFormat } = require('../utils/regex')

const createUser = async (body) => {
  return await User.create(body)
}

const findUser = async (email, password) => {
  return await User.findOne({ where: { email: email, password: password } })
}

const checkEmail = async (email) => {
  let isValidEmail = await !regex.isValidEmail(email)
  if (isValidEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, '이메일 형식이 맞지 않습니다. 다시 입력해 주세요.')
  }

  let emailCount = await User.count({ where: { email: `${email}` } })
  if (emailCount > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, '이미 등록된 이메일입니다. 다시 입력해 주세요.')
  }
}

const checkUsername = async (username) => {
  let usernameCount = await User.count({ where: { username: `${username}` } })
  if (usernameCount > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, '이미 등록된 닉네임입니다. 다시 입력해 주세요.')
  }
}

const checkPassword = async (password) => {
  let isValidPassword = await !regex.isValidPassword(password)
  if (isValidPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      '유효하지 않은 패스워드입니다. 다시 입력해 주세요. (길이 최소 8자 이상 15자 이하, 대문자, 소문자, 숫자, 특수문자(@,$,!,%,*,?,&) 각각 1개 이상 필수 입력)'
    )
  }
}

const changePassword = async (email, oldPassword, newPassword) => {
  await commonService.checkValueIsEmpty(oldPassword, '기존 패스워드')
  await commonService.checkValueIsEmpty(newPassword, '새 패스워드')

  //let decryptOldPassword = decryptAES256(oldPassword) => aes256 적용 코드
  let decryptOldPassword = oldPassword
  let encryptOldPassword = encryptSHA256(decryptOldPassword)
  //let decryptNewPassword = decryptAES256(newPassword) => aes256 적용 코드
  let decryptNewPassword = newPassword
  let encryptNewPassword = encryptSHA256(decryptNewPassword)
  let user = await findUser(email, encryptOldPassword)

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, '기존 패스워드가 정확하지 않습니다. 다시 입력해주세요.')
  }

  await checkPassword(decryptNewPassword)
  if (oldPassword == newPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, '새 패스워드가 기존과 동일합니다. 다시 입력해 주세요.')
  }

  User.update({ password: encryptNewPassword, updatedAt: new Date() }, { where: { email: email, password: encryptOldPassword } })
}

const followUser = async (data) => {
  if (data.userId == data.followUserId) {
    throw new ApiError(httpStatus.BAD_REQUEST, '자기 자신을 팔로우 할 수 없습니다. 다시 시도해 주세요.')
  }

  if (data.followYn == 'Y') {
    UserFollow.upsert({ fromUserId: data.userId, toUserId: data.followUserId })
  } else {
    UserFollow.destroy({ where: { fromUserId: data.userId, toUserId: data.followUserId } })
  }
}

const getNotFollowingList = async (req, data) => {
  let serviceUrl = config.fileHost
  let commonImagePath = config.commonImagePath.split('public')[1]
  let profileImagePath = config.profileImagePath.split('public')[1]

  let followingList = await User.findAll({
    include: [
      { model: UserFollow, as: 'ToUserFollow', required: false, where: { fromUserId: data.userId } },
      { model: Image, required: false },
    ],
    where: { userId: { [Op.ne]: data.userId }, '$ToUserFollow.from_user_id$': null },
    subQuery: false,
  })

  followingList = followingList.map((followingUser) => {
    return {
      userId: followingUser.userId,
      username: followingUser.username,
      name: followingUser.name,
      profileImage: followingUser.Image ? serviceUrl + profileImagePath + followingUser.Image.imageName + '.' + followingUser.Image.imageExt : serviceUrl + commonImagePath + 'profile.png',
      followYn: followingUser.ToUserFollow.length > 0 ? 'Y' : 'N',
    }
  })

  return { followingList: followingList }
}

const getFollowingList = async (req, data) => {
  let serviceUrl = config.fileHost
  let commonImagePath = config.commonImagePath.split('public')[1]
  let profileImagePath = config.profileImagePath.split('public')[1]

  let page = !data.page ? 1 : data.page
  let pageSize = 20
  let offset = (page - 1) * pageSize

  let followingList = await User.findAll({
    include: [
      { model: UserFollow, as: 'ToUserFollow', required: true, where: { fromUserId: data.userId } },
      { model: Image, required: false },
    ],
    order: [
      ['lastLoginAt', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    offset: offset,
    limit: pageSize,
    subQuery: false,
  })

  followingList = followingList.map((followingUser) => {
    return {
      userId: followingUser.userId,
      username: followingUser.username,
      name: followingUser.name,
      profileImage: followingUser.Image ? serviceUrl + profileImagePath + followingUser.Image.imageName + '.' + followingUser.Image.imageExt : serviceUrl + commonImagePath + 'profile.png',
      followYn: followingUser.ToUserFollow.length > 0 ? 'Y' : 'N',
    }
  })

  return { page: page, followingList: followingList }
}

const getFollowerList = async (req, data) => {
  let serviceUrl = config.fileHost
  let commonImagePath = config.commonImagePath.split('public')[1]
  let profileImagePath = config.profileImagePath.split('public')[1]

  let page = !data.page ? 1 : data.page
  let pageSize = 20
  let offset = (page - 1) * pageSize

  let followerList = await User.findAll({
    include: [
      { model: UserFollow, as: 'FromUserFollow', required: true, where: { toUserId: data.userId } },
      { model: UserFollow, as: 'ToUserFollow', required: false, where: { fromUserId: data.userId } },
      { model: Image, required: false },
    ],
    order: [
      ['lastLoginAt', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    offset: offset,
    limit: pageSize,
    subQuery: false,
  })

  followerList = followerList.map((followerUser) => {
    return {
      userId: followerUser.userId,
      username: followerUser.username,
      name: followerUser.name,
      profileImage: followerUser.Image ? serviceUrl + profileImagePath + followerUser.Image.imageName + '.' + followerUser.Image.imageExt : serviceUrl + commonImagePath + 'profile.png',
      followYn: followerUser.ToUserFollow.length > 0 ? 'Y' : 'N',
    }
  })

  return { page: page, followerList: followerList }
}

const saveProfileImage = async (req, data) => {
  let user = await User.findOne({ include: { model: Image, required: false }, where: { userId: data.userId } })
  if (user == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당하는 유저가 존재하지 않습니다.')
  }

  for await (const [key, file] of Object.entries(data.files)) {
    const oldFilePath = file.filepath
    const imageExt = file.originalFilename.split('.')[1]
    const originalImageName = file.originalFilename.split('.')[0]
    const imageName = uuidv4()
    const dimensions = sizeOf(oldFilePath)
    const imageSize = file.size
    const imageWidth = dimensions.width
    const imageHeight = dimensions.height

    fs.rename(oldFilePath, __dirname + '/../' + config.profileImagePath + imageName + '.' + imageExt, async (err) => {
      if (err) {
        throw err
      }
      const image = await imageService.createImage({
        originalImageName,
        imageName,
        imageExt,
        imageSize,
        imageWidth,
        imageHeight,
      })
      await User.upsert({ userId: data.userId, profileImageId: image.imageId, updatedAt: new Date() }, { where: { userId: data.userId } })
    })

    if (user.Image) {
      let deleteImagePath = __dirname + '/../' + config.profileImagePath + user.Image.imageName + '.' + user.Image.imageExt
      fs.unlink(deleteImagePath, (err) => {
        if (!err) {
          console.log(`이미지 파일 삭제 >> ${deleteImagePath}`)
        } else {
          console.log(`이미지 파일이 존재하지 않음 >> ${deleteImagePath}`)
        }
      })
    }
  }
}

const deleteProfileImage = async (req, data) => {
  let user = await User.findOne({ include: { model: Image, required: false }, where: { userId: data.userId } })
  if (user == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당하는 유저가 존재하지 않습니다.')
  }

  if (user.Image) {
    User.upsert({ userId: data.userId, profileImageId: null }, { where: { userId: data.userId } })
    Image.destroy({ where: { imageId: user.Image.imageId } })
    let deleteImagePath = __dirname + '/../' + config.profileImagePath + user.Image.imageName + '.' + user.Image.imageExt
    fs.unlink(deleteImagePath, (err) => {
      if (!err) {
        console.log(`이미지 파일 삭제 >> ${deleteImagePath}`)
      } else {
        console.log(`이미지 파일이 존재하지 않음 >> ${deleteImagePath}`)
      }
    })
  }
}

const searchUsers = async (req, data) => {
  if (!data.keyword) {
    throw new ApiError(httpStatus.BAD_REQUEST, '검색어를 입력해 주세요.')
  }
  let serviceUrl = config.fileHost
  let commonImagePath = config.commonImagePath.split('public')[1]
  let profileImagePath = config.profileImagePath.split('public')[1]

  let page = !data.page ? 1 : data.page
  let pageSize = 30
  let offset = (page - 1) * pageSize

  let users = await User.findAll({
    include: [
      { model: Image, required: false },
      { model: UserFollow, as: 'ToUserFollow', required: false, where: { fromUserId: data.userId } },
    ],
    where: { username: { [Op.like]: '%' + data.keyword + '%' } },
    order: [['createdAt', 'desc']],
    offset: offset,
    limit: pageSize,
  })

  users = users.map((user) => {
    return {
      userId: user.userId,
      username: user.username,
      name: user.name,
      profileImage: user.Image ? serviceUrl + profileImagePath + user.Image.imageName + '.' + user.Image.imageExt : serviceUrl + commonImagePath + 'profile.png',
      followYn: user.ToUserFollow.length > 0 ? 'Y' : 'N',
    }
  })

  return users
}

const addUserSearchLog = async (data) => {
  if ((await UserSearchLog.count({ where: { fromUserId: data.userId, toUserId: data.toUserId } })) == 0) {
    await UserSearchLog.create({ fromUserId: data.userId, toUserId: data.toUserId })
  } else {
    await UserSearchLog.update({ updatedAt: new Date() }, { where: { fromUserId: data.userId, toUserId: data.toUserId } })
  }
}

const deleteUserSearchLog = async (data) => {
  await UserSearchLog.destroy({ where: { fromUserId: data.userId, toUserId: data.toUserId } })
}

const getUserSearchLogs = async (req, data) => {
  let serviceUrl = config.fileHost
  let commonImagePath = config.commonImagePath.split('public')[1]
  let profileImagePath = config.profileImagePath.split('public')[1]

  let page = 1
  let pageSize = 10
  let offset = (page - 1) * pageSize

  let userSearchLogs = await UserSearchLog.findAll({
    include: {
      model: User,
      required: true,
      include: [
        { model: Image, required: false },
        { model: UserFollow, as: 'ToUserFollow', required: false, where: { fromUserId: data.userId } },
      ],
    },
    where: { fromUserId: data.userId },
    order: [['updatedAt', 'desc']],
    offset: offset,
    limit: pageSize,
  })

  userSearchLogs = userSearchLogs.map((userSearchLog) => {
    return {
      userId: userSearchLog.User.userId,
      username: userSearchLog.User.username,
      name: userSearchLog.User.name,
      profileImage: userSearchLog.User.Image
        ? serviceUrl + profileImagePath + userSearchLog.User.Image.imageName + '.' + userSearchLog.User.Image.imageExt
        : serviceUrl + commonImagePath + 'profile.png',
      followYn: userSearchLog.User.ToUserFollow.length > 0 ? 'Y' : 'N',
      updatedAt: dateFormat(userSearchLog.updatedAt),
    }
  })

  return userSearchLogs
}

const getUserInfo = async (req, data) => {
  let serviceUrl = config.fileHost
  let commonImagePath = config.commonImagePath.split('public')[1]
  let postImagePath = config.postImagePath.split('public')[1]
  let profileImagePath = config.profileImagePath.split('public')[1]

  let user = await User.findOne({
    attributes: {
      include: [
        [sequelize.literal(`(SELECT COUNT(1) FROM tb_post WHERE user_id = ${data.targetUserId})`), 'postCount'],
        [sequelize.literal(`(SELECT COUNT(1) FROM tb_user_follow WHERE from_user_id = ${data.targetUserId})`), 'followingCount'],
        [sequelize.literal(`(SELECT COUNT(1) FROM tb_user_follow WHERE to_user_id = ${data.targetUserId})`), 'followerCount'],
      ],
    },
    include: [
      { model: Image, required: false },
      { model: UserFollow, as: 'ToUserFollow', required: false, where: { fromUserId: data.userId } },
    ],

    where: {
      userId: data.targetUserId,
    },
  })

  let followerImFollowingList = await User.findAll({
    include: [
      { model: Image, required: false },
      { model: UserFollow, as: 'FromUserFollow', required: true, where: { toUserId: data.targetUserId } },
      { model: UserFollow, as: 'ToUserFollow', required: true, where: { fromUserId: data.userId } },
    ],
  })
  followerImFollowingList = followerImFollowingList.map((follower) => {
    return {
      userId: follower.userId,
      username: follower.username,
      name: follower.name,
      profileImage: follower.Image ? serviceUrl + profileImagePath + follower.Image.imageName + '.' + follower.Image.imageExt : serviceUrl + commonImagePath + 'profile.png',
      followYn: follower.ToUserFollow.length > 0 ? 'Y' : 'N',
    }
  })

  let postList = await postService.getPostList(req, { page: 1, userId: data.userId, targetUserId: data.targetUserId })

  return {
    userId: user.userId,
    profileImage: user.Image ? serviceUrl + profileImagePath + user.Image.imageName + '.' + user.Image.imageExt : serviceUrl + commonImagePath + 'profile.png',
    name: user.name,
    username: user.username,
    bio: user.bio,
    followYn: user.ToUserFollow.length > 0 ? 'Y' : 'N',
    postCount: user.dataValues.postCount,
    followingCount: user.dataValues.followingCount,
    followerCount: user.dataValues.followerCount,
    followerImFollowingList: followerImFollowingList,
    postList: postList.postList,
  }
}

module.exports = {
  createUser,
  findUser,
  checkEmail,
  checkUsername,
  checkPassword,
  changePassword,
  followUser,
  getNotFollowingList,
  getFollowingList,
  getFollowerList,
  saveProfileImage,
  deleteProfileImage,
  searchUsers,
  addUserSearchLog,
  deleteUserSearchLog,
  getUserSearchLogs,
  getUserInfo,
}
