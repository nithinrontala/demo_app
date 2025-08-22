import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './App.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Supabase client setup
  const supabaseUrl = "https://sxcaqcaauduwzuikyehl.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2FxY2FhdWR1d3p1aWt5ZWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NjU0NzcsImV4cCI6MjA3MTQ0MTQ3N30.Dcqqaw19_OwXDBaJF_J9Gv_EyI0_cH_bgxYZJhe9HAs";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (isLogin) {
      // Login with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error) {
        navigate('/demo');
      } else {
        setMessage(error.message);
      }
    } else {
      // Signup with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (!error && data?.user) {
        // Insert user data into 'users' table
        const { error: tableError } = await supabase
          .from('users')
          .insert([{ email, auth_id: data.user.id }]);
        if (!tableError) {
          setIsLogin(true);
          setMessage('Signup successful! Please verify your email and login.');
        } else {
          setMessage('Signup succeeded.');
        }
      } else {
        setMessage(error?.message || 'Signup failed');
      }
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)} className="toggle-form">
          {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
        </p>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
