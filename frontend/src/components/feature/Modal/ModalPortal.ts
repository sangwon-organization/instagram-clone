import reactDom from 'react-dom';

const ModalPortal = ({ children }: any) => {
  const modalRoot = document.getElementById('modal');
  return reactDom.createPortal(children, modalRoot);
};

export default ModalPortal;
