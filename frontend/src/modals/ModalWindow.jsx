import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../socket';

const ModalWindow = ({ inputRef, onClose, actionType }) => {
  const channels = useSelector((state) => state.channels);
  const currentChatChannelId = useSelector((state) => state.currentChannel);

  const [modalError, setModalError] = useState(false);

  const modalWindowSchema = yup.object().shape({
    name: yup
      .string()
      .required('Обязательное поле')
      .min(3, 'Имя канала должно содержать минимум 3 символа')
      .max(20, 'Имя канала не должно превышать 20 символов')
      .notOneOf(channels.map(({ name }) => name), 'Должно быть уникальным'),
  });

  const titleMap = {
    add: 'Добавить канал',
    delete: 'Удалить канал',
    rename: 'Переименовать канал',
  };

  const buttonTitles = {
    add: 'Отправить',
    delete: 'Удалить',
    rename: 'Отправить',
  };
  const submitFunctions = {
    add: (channelName) => socket.emit('newChannel', channelName),
    delete: (id) => socket.emit('removeChannel', { id }),
    rename: (channelName, channelId) => socket.emit('renameChannel', { channelId, channelName }),
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: modalWindowSchema,
    onSubmit: (values) => {
      try {
        submitFunctions[actionType](values); // Используйте values, а не currentChatChannelId
        onClose();
      } catch (e) {
        setModalError(true);
      }
    },
  });

  const handleDeleteChannel = () => {
    submitFunctions[actionType](currentChatChannelId);
    onClose();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const modalFooter = () => (
    <div className="d-flex justify-content-end">
      <button onClick={onClose} type="button" className="me-2 btn btn-secondary">
        Отменить
      </button>
      <button
        onClick={actionType !== 'delete' ? formik.handleSubmit : handleDeleteChannel}
        type="button"
        className={`btn btn-${actionType === 'delete' ? 'danger' : 'primary'}`}
      >
        {buttonTitles[actionType]}
      </button>
    </div>
  );

  return (
    <div role="dialog" aria-modal="true" className="fade modal show" tabIndex="-1" style={{ display: 'block' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title h4">{titleMap[actionType]}</div>
            <button onClick={onClose} type="button" aria-label="Close" data-bs-dismiss="modal" className="btn btn-close" />
          </div>
          <div className="modal-body">
            {actionType !== 'delete' ? (
              <form onSubmit={formik.handleSubmit} className="">
                <div>
                  <input
                    name="name"
                    id="name"
                    className={`mb-2 form-control ${modalError && 'is-invalid'}`}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    ref={inputRef}
                  />
                  <label className="visually-hidden" htmlFor="name">
                    Имя канала
                  </label>
                  {formik.errors.name && <div className="error-message">{formik.errors.name}</div>}
                  <div className="invalid-feedback" />
                </div>
                {modalFooter()}
              </form>
            ) : (
              <>
                <p className="lead">Уверены?</p>
                {modalFooter()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWindow;
