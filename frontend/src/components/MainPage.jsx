import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../socket.js';
import { setChannels, addChannel, removeChannel } from '../slices/channelsSlice.js';
import { setCurrentChannel } from '../slices/currentChannelSlice.js';
import { setMessages, addMessage } from '../slices/messagesSlice.js';
import ModalWindow from '../modals/ModalWindow.jsx';
import Channels from '../Channels.jsx';

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [modalState, setModalState] = useState('');

  const chatChannels = useSelector((state) => state.channels);
  const currentChatChannelId = useSelector((state) => state.currentChannel);
  const chatMessages = useSelector((state) => state.messages);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      axios.get('/api/v1/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        const { channels, currentChannelId, messages } = response.data;

        dispatch(setChannels(channels));
        dispatch(setCurrentChannel(currentChannelId));
        dispatch(setMessages(messages));
        console.log(channels, currentChannelId, messages);
        inputRef.current?.focus();
      })
        .catch((error) => {
          console.error('Ошибка при получении данных с сервера:', error);
        });
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    socket.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });
    socket.on('newChannel', (channel) => {
      dispatch(addChannel(channel));
      dispatch(setCurrentChannel((channel.id)));
    });
    socket.on('removeChannel', (id) => {
      dispatch(removeChannel(id)); // { id: 10 }
      console.log(chatChannels);
    });

    return () => {
      socket.off('newMessage');
      socket.off('newChannel');
      socket.off('removeChannel');
    };
  }, [dispatch, chatChannels]);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: (values) => {
      socket.emit('newMessage', { body: values.body, channelId: currentChatChannelId, username: 'admin' });
      formik.resetForm();
    },
  });

  return (
    <>
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
              <div className="container">
                <a className="navbar-brand" href="/">Hexlet Chat</a>
                <button type="button" className="btn btn-primary">Выйти</button>
              </div>
            </nav>
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <div className="row h-100 bg-white flex-md-row">
                <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
                  <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                    <b>Каналы</b>
                    <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={() => { setModalState('add'); }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        width="20"
                        height="20"
                        fill="currentColor"
                      >
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                      </svg>
                      <span className="visually-hidden">+</span>
                    </button>

                  </div>
                  <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
                    <Channels
                      setActionType={setModalState}
                      inputRef={inputRef}
                    />
                  </ul>
                </div>
                <div className="col p-0 h-100">
                  <div className="d-flex flex-column h-100">
                    <div className="bg-light mb-4 p-3 shadow-sm small">
                      <p className="m-0">
                        <b># {chatChannels.find(({ id }) => id === currentChatChannelId)?.name}</b>
                      </p>
                      <span className="text-muted">{chatMessages.filter(({ channelId }) => channelId === currentChatChannelId).length} сообщений</span>
                    </div>
                    <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                      { chatMessages
                        .filter(({ channelId }) => channelId === currentChatChannelId)
                        .map(({ id, body, username }) => (
                          <div key={id} className="text-break mb-2"><b>{username}</b>: {body}</div>
                        ))}
                    </div>
                    <div className="mt-auto px-5 py-3">
                      <form onSubmit={formik.handleSubmit} noValidate="" className="py-1 border rounded-2">
                        <div className="input-group has-validation">
                          <input
                            name="body"
                            aria-label="Новое сообщение"
                            placeholder="Введите сообщение..."
                            className="border-0 p-0 ps-2 form-control"
                            value={formik.values.body}
                            onChange={formik.handleChange}
                            ref={inputRef}
                          />
                          <button type="submit" className="btn btn-group-vertical">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              width="20"
                              height="20"
                              fill="currentColor"
                            >
                              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                            </svg>
                            <span className="visually-hidden">Отправить</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="Toastify" />
        </div>
      </div>
      { modalState && (
      <ModalWindow
        actionType={modalState}
        inputRef={inputRef}
        onClose={() => { setModalState(''); }}
      />
      ) }
    </>
  );
};

export default MainPage;
