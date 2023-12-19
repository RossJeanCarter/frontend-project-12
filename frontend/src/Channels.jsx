/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/style-prop-object */
/* eslint-disable react/no-unknown-property */
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { setCurrentChannel } from './slices/currentChannelSlice.js';

const Channels = ({ inputRef, setActionType }) => {
  const { channels, currentChannel: currentChatChannelId } = useSelector((state) => state);

  const dispatch = useDispatch();
  const [activeChannelMenu, setActiveChannelMenu] = useState(false);

  useEffect(() => {
    setActiveChannelMenu(false);
  }, [currentChatChannelId, channels]);

  const toggleChannelMenu = (channelId) => {
    setActiveChannelMenu((prevMenu) => (prevMenu === channelId ? null : channelId));
  };

  return (
    channels.map(({ id, name }) => {
      const isMenuActive = id === activeChannelMenu;

      return (
        <li key={id} className="nav-item w-100">
          <div className={`d-flex btn-group ${isMenuActive ? 'show' : ''}`}>
            <button
              type="button"
              className={`w-100 rounded-0 text-start btn ${id === currentChatChannelId && 'btn-secondary'}`}
              onClick={() => {
                dispatch(setCurrentChannel(id));
                inputRef.current?.focus();
              }}
            >
              <span className="me-1">#</span>{name}
            </button>
            {id >= 3 && (
            <>
              <button
                onClick={() => toggleChannelMenu(id)}
                type="button"
                aria-expanded={isMenuActive}
                className="flex-grow-0 dropdown-toggle dropdown-toggle-split btn"
              >
                <span className="visually-hidden">Управление каналом</span>
              </button>
              <div
                x-placement="bottom-end"
                aria-labelledby={`react-aria-${id}`}
                className={`dropdown-menu ${isMenuActive ? 'show' : ''}`}
                data-popper-reference-hidden="false"
                data-popper-escaped="false"
                data-popper-placement="bottom-end"
                style={{
                  position: 'absolute',
                  inset: '0 auto auto 0',
                  transform: 'translate3d(-8px, 40px, 0)',
                }}
              >
                <a onClick={() => setActionType('delete')} data-rr-ui-dropdown-item="" className="dropdown-item" role="button" tabIndex="0" href="#">Удалить</a>
                <a onClick={() => setActionType('rename')} data-rr-ui-dropdown-item="" className="dropdown-item" role="button" tabIndex="0" href="#">Переименовать</a>
              </div>
            </>
            )}
          </div>
        </li>
      );
    })
  );
};

export default Channels;
