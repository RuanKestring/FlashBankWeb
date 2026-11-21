import { useEffect, useRef, useState } from 'react'
import logo from './assets/icons/Logo.svg'
import heroImage from './assets/images/imagem-tela-login.webp'
import user from '../data/user.json'
import { login, isLogged } from '../js/core/auth.js'
import { digits, formatCpf, maskCpf } from '../js/core/format.js'

function Login() {
  const [useSavedAccount, setUseSavedAccount] = useState(true)
  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const cpfInputRef = useRef(null)

  useEffect(() => {
    if (!useSavedAccount) cpfInputRef.current?.focus()
  }, [useSavedAccount])

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(''), 2500)
    return () => window.clearTimeout(timeout)
  }, [notice])

  useEffect(() => {
    if (isLogged()) window.location.replace('/pages/home.html')
  }, [])

  function showComingSoon(event, message) {
    event.preventDefault()
    setNotice(message)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const typedCpf = useSavedAccount ? user.cpf : digits(cpf)

    if (typedCpf.length !== 11) {
      setError('Digite um CPF com 11 números.')
      cpfInputRef.current?.focus()
      return
    }

    if (!password) {
      setError('Digite sua senha.')
      document.getElementById('senha')?.focus()
      return
    }

    if (typedCpf !== user.cpf || password !== user.senha) {
      setError('CPF ou senha incorretos. Confira os dados e tente de novo.')
      return
    }

    login(user)
    // A Home ainda é a página HTML antiga; ela será migrada numa etapa futura.
    window.location.assign('/pages/home.html')
  }

  return (
    <div className="login">
      <header className="login__top">
        <a className="login__logo" href="/" aria-label="FlashBank, página de login">
          <img src={logo} alt="FlashBank" height="50" />
        </a>
        <div className="login__top-right">
          <span>Seu banco, sempre perto.</span>
          <a
            className="help-link"
            href="#ajuda"
            onClick={(event) => showComingSoon(event, 'A ajuda chega em breve.')}
          >
            <span className="icon" data-icon="seguro" aria-hidden="true" />
            Precisa de ajuda?
          </a>
        </div>
      </header>

      <main className="login__main">
        <section className="login__hero" aria-labelledby="hero-title">
          <p className="eyebrow">
            <span className="eyebrow__dot" aria-hidden="true" />
            Mais tempo para o que importa
          </p>
          <h1 id="hero-title">
            Sua vida acontece.<br />
            Seu banco acompanha.
          </h1>
          <p className="hero__text">
            Da rotina aos próximos planos, cuide do seu dinheiro com a tranquilidade de ter o FlashBank ao seu lado.
          </p>
          <figure className="hero__photo">
            <img
              src={heroImage}
              alt="Mulher sorrindo enquanto usa o notebook em um ambiente aconchegante"
              width="1160"
              height="566"
            />
          </figure>
          <p className="hero__secure">
            <span className="icon" data-icon="seguro" aria-hidden="true" />
            Sua segurança vem em primeiro lugar. Sempre.
          </p>
        </section>

        <form className="login__form" id="login-form" noValidate onSubmit={handleSubmit}>
          <div className="login__user">
            <span className="avatar avatar--soft avatar--xl" aria-hidden="true">
              <span className="icon" data-icon="avatar" />
            </span>
            <h2>{useSavedAccount ? `Olá, ${user.nome}` : 'Olá!'}</h2>
            <p className="muted">
              {useSavedAccount ? 'Que bom ter você de volta.' : 'Digite seu CPF para entrar.'}
            </p>
          </div>

          {useSavedAccount && (
            <div className="saved-account" id="saved-account">
              <span>CPF <b>{maskCpf(user.cpf)}</b></span>
              <button className="link" id="switch-account" type="button" onClick={() => setUseSavedAccount(false)}>
                Trocar conta
              </button>
            </div>
          )}

          {!useSavedAccount && (
            <div className="field" id="cpf-field">
              <label htmlFor="cpf">CPF</label>
              <input
                ref={cpfInputRef}
                id="cpf"
                name="cpf"
                inputMode="numeric"
                autoComplete="username"
                placeholder="000.000.000-00"
                maxLength={14}
                aria-describedby="login-error"
                value={cpf}
                onChange={(event) => setCpf(formatCpf(event.target.value))}
              />
            </div>
          )}

          <div className="field field--password">
            <label htmlFor="senha">Senha</label>
            <div className="input-wrap">
              <input
                id="senha"
                name="senha"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Sua senha"
                aria-describedby="login-error"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className="icon-btn icon-btn--soft"
                id="toggle-senha"
                type="button"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? (
                  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.7 5.1A10 10 0 0 1 12 5c7 0 10 7 10 7a13 13 0 0 1-1.7 2.7M6.6 6.7A13 13 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.4-1.6M2 2l20 20M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                  </svg>
                )}
              </button>
            </div>
            <a
              className="link forgot"
              href="#recuperar-senha"
              onClick={(event) => showComingSoon(event, 'A recuperação de senha chega em breve.')}
            >
              Esqueceu a senha?
            </a>
          </div>

          <p className="form-error" id="login-error" role="alert">{error}</p>
          <button className="btn btn--primary btn--block btn--lg" type="submit">Entrar</button>
          <div className="divider" role="separator"><span>ou</span></div>
          <button
            className="btn btn--outline btn--block btn--lg"
            id="faceid"
            type="button"
            onClick={() => setNotice('Face ID disponível em breve.')}
          >
            <span className="icon" data-icon="scan-face" aria-hidden="true" />
            Entrar com Face ID
          </button>
          <p className="login__note">
            <span className="icon" data-icon="cadeado" aria-hidden="true" />
            Ambiente seguro. Seus dados estão protegidos.
          </p>
        </form>
      </main>

      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  )
}

export default Login
