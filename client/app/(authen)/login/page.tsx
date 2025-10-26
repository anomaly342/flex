export default function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-logo">
        <img src="#" alt="logo" />
      </div>

      <div>
        <form className="login-form">
          <label>
            Username:
            <input type="text" name="username" placeholder="Enter username" />
          </label>

          <label>
            Password:
            <input
              type="password"
              name="password"
              placeholder="Enter password"
            />
          </label>

          <div className="btn">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
      <div className="alt-register">
        <div className="alt-line">
          <div className="line"></div> 
          <p className="p-or">OR</p>
          <div className="line"></div> 
        </div>
        <p>
          Don't have an account? <a href="/register">Register Now</a>
        </p>
      </div>
    </div>
  );
}
