<template>
  <div class="login-container">
    <div class="login-box ui segment">
      <div class="center aligned">
        <h2 class="ui teal image header">
          <i class="desktop icon"></i>
          <div class="content">IT Helpdesk Login</div>
        </h2>
      </div>

      <form class="ui large form" @submit.prevent="handleLogin" :class="{ loading: isLoading }">
        <div class="ui stacked segment no-border">
          <div class="field">
            <label>Username</label>
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" v-model="username" placeholder="Enter username" required>
            </div>
          </div>
          <div class="field">
            <label>Password</label>
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" v-model="password" placeholder="Enter password" required>
            </div>
          </div>
          <button class="ui fluid large teal submit button">Login</button>
        </div>

        <div class="ui error message" v-if="errorMsg">{{ errorMsg }}</div>
      </form>

      <div class="ui message center aligned">
        For staff use only. <router-link to="/">Back to home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../api';
export default {
  data() {
    return {
      username: '',
      password: '',
      errorMsg: '',
      isLoading: false
    }
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      try {
        const res = await api.post('/api/auth/login', {
          username: this.username,
          password: this.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('username', res.data.username);
        this.$router.push('/responses');
      } catch (err) {
        this.errorMsg = "Incorrect username or password!";
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  background-image: radial-gradient(#00b5ad 0.5px, #f0f2f5 0.5px);
  background-size: 20px 20px;
}
.login-box {
  width: 100%;
  max-width: 450px;
  padding: 30px !important;
  border-radius: 15px !important;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
  border: none !important;
}
.no-border { box-shadow: none !important; border: none !important; padding: 20px 0 !important; }
.login-box h2 { margin-bottom: 25px !important; }
.field label { font-weight: 600 !important; color: #555 !important; }
.ui.teal.button { background-color: #00b5ad !important; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
</style>