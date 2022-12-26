import reactDom from 'react-dom';

const ModalPortal = ({ children }: { children: JSX.Element }) => {
  const modalRoot = document.getElementById('modal');
  return reactDom.createPortal(children, modalRoot);
};

export default ModalPortal;
