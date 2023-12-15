import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupSchema = yup.object().shape({
  username: yup.string().required('Обязательное поле'),
  password: yup.string().required('Обязательное поле'),
});

const SignupForm = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const usernameInputRef = useRef(null);
  const [authentificationError, setAuthentificationError] = useState(false);

  useEffect(() => {
    usernameInputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      axios.post('/api/v1/login', values).then((response) => {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        navigate('/');
      })
        .catch((error) => {
          console.log(error);
          setAuthentificationError(true);
        });
    },
  });

  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">Hexlet Chat</a>
            </div>
          </nav>
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img src="images/hexleticon.jpeg" className="rounded-circle" alt="Войти" />
                    </div>
                    <form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                      <h1 className="text-center mb-4">Войти</h1>
                      <div className="form-floating mb-3">
                        <input
                          name="username"
                          autoComplete="username"
                          required=""
                          placeholder="Ваш ник"
                          id="username"
                          className={`form-control ${authentificationError && 'is-invalid'}`}
                          value={formik.values.username}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          ref={usernameInputRef}
                        />
                        {formik.touched.username && formik.errors.username && (
                          <div className="error-message">{formik.errors.username}</div>
                        )}
                        <label htmlFor="username">Ваш ник</label>
                      </div>
                      <div className="form-floating mb-4">
                        <input
                          name="password"
                          autoComplete="current-password"
                          required=""
                          placeholder="Пароль"
                          type="password"
                          id="password"
                          className={`form-control ${authentificationError && 'is-invalid'}`}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password && (
                          <div className="error-message">{formik.errors.password}</div>
                        )}
                        <label className="form-label" htmlFor="password">Пароль</label>
                        { authentificationError && <div className="invalid-tooltip">Неверные имя пользователя или пароль</div> }
                      </div>
                      <button type="submit" className="w-100 mb-3 btn btn-outline-primary">Войти</button>
                    </form>
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>Нет аккаунта? </span>
                      <a href="/signup">Регистрация</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Toastify" />
      </div>
    </div>
  );
};

export default SignupForm;
