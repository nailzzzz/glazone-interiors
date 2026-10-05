import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  MdEmail,
  MdLock,
  MdArrowForward
} from 'react-icons/md';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // --------------------------------------------------
  // ALREADY LOGGED IN
  // --------------------------------------------------

  if (currentUser) {
    return <Navigate to="/admin" replace />;
  }

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting Firebase login...');
      console.log('Email:', cleanEmail);

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      console.log(
        'Login successful:',
        userCredential.user.email
      );

      toast.success('Login successful!');

      navigate('/admin', { replace: true });

    } catch (error) {
      console.error('================================');
      console.error('LOGIN ERROR:', error);
      console.error('ERROR CODE:', error?.code);
      console.error('ERROR MESSAGE:', error?.message);
      console.error('================================');

      switch (error?.code) {

        case 'auth/invalid-credential':
          toast.error(
            'Invalid email or password.'
          );
          break;

        case 'auth/user-not-found':
          toast.error(
            'Admin account not found.'
          );
          break;

        case 'auth/wrong-password':
          toast.error(
            'Incorrect password.'
          );
          break;

        case 'auth/invalid-email':
          toast.error(
            'Please enter a valid email address.'
          );
          break;

        case 'auth/user-disabled':
          toast.error(
            'This admin account has been disabled.'
          );
          break;

        case 'auth/too-many-requests':
          toast.error(
            'Too many login attempts. Please try again later.'
          );
          break;

        case 'auth/network-request-failed':
          toast.error(
            'Network error. Please check your internet connection.'
          );
          break;

        case 'auth/operation-not-allowed':
          toast.error(
            'Email/Password login is not enabled in Firebase.'
          );
          break;

        default:
          toast.error(
            error?.message ||
            'Login failed. Please try again.'
          );
      }

    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // FORGOT PASSWORD
  // --------------------------------------------------

  const handleResetPassword = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      toast.error(
        'Please enter your email address first.'
      );
      return;
    }

    setResetting(true);

    try {

      await sendPasswordResetEmail(
        auth,
        cleanEmail
      );

      toast.success(
        'Password reset email sent! Check your inbox.'
      );

    } catch (error) {

      console.error(
        'PASSWORD RESET ERROR:',
        error
      );

      console.error(
        'ERROR CODE:',
        error?.code
      );

      if (error?.code === 'auth/user-not-found') {

        toast.error(
          'No admin account exists with this email.'
        );

      } else if (error?.code === 'auth/invalid-email') {

        toast.error(
          'Please enter a valid email address.'
        );

      } else if (
        error?.code === 'auth/operation-not-allowed'
      ) {

        toast.error(
          'Email/Password Authentication is not enabled.'
        );

      } else {

        toast.error(
          error?.message ||
          'Unable to send password reset email.'
        );
      }

    } finally {
      setResetting(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy flex items-center justify-center relative overflow-hidden px-4">

      {/* Decorative Background */}

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-royal/20 rounded-full blur-[100px] pointer-events-none"></div>


      {/* Login Card */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5
        }}
        className="w-full max-w-md relative z-10"
      >

        <div className="bg-white/80 dark:bg-navy/60 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 md:p-10">

          {/* Header */}

          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky to-royal mb-2">
              Admin Portal
            </h1>

            <p className="text-slate-500 dark:text-slate-400">
              Sign in to manage your website content.
            </p>

          </div>


          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* EMAIL */}

            <div>

              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Email Address
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                  <MdEmail className="text-slate-400 text-lg" />

                </div>

                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 text-slate-900 dark:text-white transition-all disabled:opacity-60"
                  placeholder="admin@glazone.com"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div>

              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Password
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">

                  <MdLock className="text-slate-400 text-lg" />

                </div>

                <input
                  id="admin-password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/50 text-slate-900 dark:text-white transition-all disabled:opacity-60"
                  placeholder="••••••••"
                />

              </div>


              {/* FORGOT PASSWORD */}

              <div className="flex justify-end mt-2">

                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={resetting || loading}
                  className="text-sm text-sky hover:text-royal transition-colors disabled:opacity-50"
                >

                  {resetting
                    ? 'Sending...'
                    : 'Forgot Password?'}

                </button>

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-sky to-royal hover:from-royal hover:to-sky text-white font-bold rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >

              {loading ? (

                <>
                  <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

                  Signing in...
                </>

              ) : (

                <>
                  Sign In
                  <MdArrowForward className="text-xl" />
                </>

              )}

            </button>

          </form>


          {/* FOOTER */}

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">

            <p>
              Protected by Firebase Authentication.
            </p>

            <p className="mt-1">
              Use the admin email and password created in Firebase.
            </p>

          </div>

        </div>

      </motion.div>

    </div>
  );
}