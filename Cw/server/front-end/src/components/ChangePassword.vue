<template>
  <div class="change-password-shell">
    <div class="change-password-card">
      <div class="card-header">
        <div>
          <h2>Change Password</h2>
          <p>Update your account password in a secure and easy way.</p>
        </div>
        <span class="badge">Security</span>
      </div>

      <form @submit.prevent="changePassword" class="ui form change-form">
        <div class="field">
          <label>Current Password</label>
          <input v-model="oldPassword" type="password" placeholder="Enter current password" required />
        </div>
        <div class="field">
          <label>New Password</label>
          <input v-model="newPassword" type="password" placeholder="Enter new password" required />
        </div>
        <div class="field">
          <label>Confirm New Password</label>
          <input v-model="confirmPassword" type="password" placeholder="Repeat new password" required />
        </div>

        <button type="submit" class="ui fluid large primary button" :disabled="loading">
          <i v-if="loading" class="spinner loading icon"></i>
          {{ loading ? 'Updating...' : 'Update Password' }}
        </button>
      </form>

      <div v-if="message" class="ui message" :class="messageType">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../api.js';

export default {
  name: 'ChangePassword',
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      message: '',
      messageType: '',
      loading: false
    };
  },
  methods: {
    async changePassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.message = 'New passwords do not match.';
        this.messageType = 'error';
        return;
      }
      this.loading = true;
      try {
        const response = await api.put('/api/auth/change-password', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        });
        this.message = response.data.message;
        this.messageType = 'success';
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      } catch (error) {
        console.error('Change password error:', error);
        this.message = error.response?.data?.message || 'Error changing password.';
        this.messageType = 'error';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.change-password-shell {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
.change-password-card {
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 26px;
}
.card-header h2 {
  margin: 0 0 8px;
  font-size: 1.9rem;
}
.card-header p {
  margin: 0;
  color: #657786;
}
.badge {
  background: #f0f5ff;
  color: #353cca;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
}
.change-form .field label {
  font-weight: 600;
  color: #2c3e50;
}
.change-form input {
  border-radius: 14px !important;
  border: 1px solid #d8dee8 !important;
  padding: 14px !important;
}
.change-form input:focus {
  border-color: #5e72e4 !important;
  box-shadow: 0 0 0 4px rgba(94, 114, 228, 0.12) !important;
}
.ui.message {
  margin-top: 20px;
  border-radius: 14px !important;
}
.change-password-card .ui.button {
  margin-top: 18px !important;
  border-radius: 999px !important;
  padding: 16px 0 !important;
  font-size: 1rem !important;
}
</style>
