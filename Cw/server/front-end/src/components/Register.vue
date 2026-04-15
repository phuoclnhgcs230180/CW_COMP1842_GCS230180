<template>
  <div class="register-shell">
    <div class="ui centered card form-card">
      <div class="content">
        <div class="card-title-row">
          <div>
            <h2 class="ui header">Create Staff Account</h2>
            <p>Register a new team member for the helpdesk system.</p>
          </div>
        </div>

        <form class="ui form" @submit.prevent="handleRegister">
          <div class="field">
            <label>Username</label>
            <input type="text" v-model="user.username" placeholder="Enter a username" required>
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" v-model="user.password" placeholder="Choose a strong password" required>
          </div>
          <div class="field">
            <label>Role</label>
            <select v-model="user.role" class="ui dropdown" required>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button class="ui fluid large teal button" type="submit">Register Account</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../api';
export default {
  data() {
    return {
      user: { username: '', password: '', role: 'staff' }
    };
  },
  methods: {
    async handleRegister() {
      try {
        await api.post('/api/auth/register', this.user);
        alert('Account created successfully!');
        this.user = { username: '', password: '', role: 'staff' };
      } catch (e) {
        console.error(e);
        alert('An error occurred while creating the account.');
      }
    }
  }
}
</script>

<style scoped>
.register-shell { padding-top: 24px; display: flex; justify-content: center; }
.form-card { width: 100%; max-width: 560px; border-radius: 24px !important; box-shadow: 0 28px 60px rgba(15, 23, 42, 0.12) !important; }
.form-card .content { padding: 36px !important; }
.card-title-row { margin-bottom: 24px; }
.card-title-row h2 { margin-bottom: 6px; }
.card-title-row p { color: #6c7a89; margin: 0; }
.ui.form .field label { font-weight: 600; color: #2c3e50; }
.ui.form input, .ui.form select { border-radius: 14px !important; border: 1px solid #d9e2ef !important; }
.ui.form input:focus, .ui.form select:focus { box-shadow: 0 0 0 4px rgba(109, 131, 255, 0.12) !important; border-color: #6d83ff !important; }
.ui.form .ui.button { border-radius: 999px !important; margin-top: 1.2rem; padding: 16px 0 !important; font-weight: 700 !important; }
</style>