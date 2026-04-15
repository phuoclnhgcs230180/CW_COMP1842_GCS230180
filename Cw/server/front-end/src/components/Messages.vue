<template>
  <div class="messages-wrapper">
    <div class="messages-header">
      <h1>Support Communication Center</h1>
      <p class="subtitle">{{ role === 'staff' ? 'Contact Administrator' : 'Staff Communication Hub' }}</p>
    </div>

    <div class="messages-content">
      <!-- Main Messages Display -->
      <div class="messages-main">
        <div class="messages-box">
          <div class="box-header">
            <i class="envelope icon"></i>
            <span>Messages</span>
            <button @click="refreshMessages" class="ui mini right floated button" title="Refresh messages">
              <i class="sync alternate icon"></i>
            </button>
          </div>
          
          <div class="messages-list">
            <div v-if="messages.length === 0" class="empty-state">
              <i class="large inbox icon"></i>
              <p>No messages yet</p>
              <small>Messages will appear here</small>
            </div>
            
            <div v-for="msg in messages" :key="msg._id" class="message-item" :class="{ unread: !msg.isRead }">
              <div class="message-header-row">
                <div class="message-title">
                  <h4>{{ msg.subject }}</h4>
                </div>
                <div class="message-date">
                  {{ formatDate(msg.createdAt) }}
                </div>
              </div>
              
              <div class="message-meta">
                <span class="from-label">
                  <strong>From:</strong> {{ msg.from?.username }} 
                  <span class="role-badge" :class="msg.from?.role">{{ msg.from?.role }}</span>
                </span>
              </div>

              <div class="message-body">
                {{ msg.message }}
              </div>

              <div class="message-footer">
                <button 
                  v-if="!msg.isRead && msg.to?._id === userId" 
                  @click="markAsRead(msg._id)" 
                  class="ui mini primary button"
                >
                  <i class="check icon"></i> Mark as Read
                </button>
                <span v-if="msg.isRead" class="ui label">
                  <i class="check icon"></i> Read
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Send Message Section -->
      <div class="messages-sidebar">
        <div class="compose-box">
          <div class="box-header">
            <i class="pen square icon"></i>
            <span>{{ role === 'staff' ? 'Contact Admin' : 'Send Message' }}</span>
          </div>

          <form @submit.prevent="sendMessage" class="compose-form">
            <div v-if="role === 'admin'" class="form-group">
              <label>Select Recipient</label>
              <select v-model="toUser" class="ui dropdown full-width" required>
                <option value="">-- Choose Staff --</option>
                <option v-for="staff in staffList" :key="staff._id" :value="staff._id">
                  {{ staff.username }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Subject <span class="required">*</span></label>
              <input 
                v-model="subject" 
                type="text" 
                class="full-width"
                placeholder="e.g., Error Code Proposal"
                required 
              />
            </div>

            <div class="form-group">
              <label>Message <span class="required">*</span></label>
              <textarea 
                v-model="messageText" 
                rows="6" 
                class="full-width compose-textarea"
                placeholder="Enter your message here..."
                required
              ></textarea>
              <small class="char-count">{{ messageText.length }} characters</small>
            </div>

            <button type="submit" class="ui primary button full-width" :disabled="sending">
              <i :class="sending ? 'spinner loading' : 'paper plane'" icon></i>
              {{ sending ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../api.js';

export default {
  name: 'Messages',
  data() {
    return {
      messages: [],
      staffList: [],
      toUser: '',
      subject: '',
      messageText: '',
      sending: false,
      role: localStorage.getItem('role'),
      userId: null,
      refreshInterval: null
    };
  },
  async created() {
    this.userId = this.getUserIdFromToken();
    console.log('Current user ID:', this.userId);
    console.log('Current user role:', this.role);
    await this.fetchMessages();
    if (this.role === 'admin') {
      await this.fetchStaff();
    }
    // Refresh messages every 5 seconds
    this.refreshInterval = setInterval(this.refreshMessages, 5000);
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    async sendMessage() {
      if (!this.subject.trim() || !this.messageText.trim()) {
        alert('Please fill in all fields');
        return;
      }

      if (this.role === 'admin' && !this.toUser) {
        alert('Please select a staff member');
        return;
      }

      this.sending = true;
      try {
        const payload = {
          subject: this.subject,
          message: this.messageText
        };
        
        if (this.role === 'admin') {
          payload.to = this.toUser;
        }

        const response = await api.post('/api/messages/send', payload);
        console.log('Message sent:', response.data);
        
        this.subject = '';
        this.messageText = '';
        this.toUser = '';
        
        await this.fetchMessages();
        alert('Message sent successfully!');
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Error: ' + (error.response?.data?.message || error.message));
      } finally {
        this.sending = false;
      }
    },

    async fetchMessages() {
      try {
        const response = await api.get('/api/messages');
        console.log('Fetched messages:', response.data);
        this.messages = response.data || [];
      } catch (error) {
        console.error('Error fetching messages:', error);
        this.messages = [];
      }
    },

    async refreshMessages() {
      await this.fetchMessages();
    },

    async fetchStaff() {
      try {
        const response = await api.get('/api/auth/users');
        this.staffList = (response.data || []).filter(user => user.role === 'staff');
        console.log('Fetched staff:', this.staffList);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    },

    async markAsRead(id) {
      try {
        await api.put(`/api/messages/${id}/read`);
        await this.fetchMessages();
      } catch (error) {
        console.error('Error marking as read:', error);
        alert('Error: ' + error.message);
      }
    },

    getUserIdFromToken() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.id;
        } catch (e) {
          console.error('Error parsing token:', e);
          return null;
        }
      }
      return null;
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    }
  }
};
</script>

<style scoped>
.messages-wrapper {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 30px 20px;
}

.messages-header {
  text-align: center;
  margin-bottom: 40px;
  color: #2c3e50;
}

.messages-header h1 {
  font-size: 2.5em;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.messages-header .subtitle {
  font-size: 1.1em;
  color: #7f8c8d;
  margin: 0;
}

.messages-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 25px;
  max-width: 1400px;
  margin: 0 auto;
}

.messages-main {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.messages-sidebar {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.box-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 1.1em;
}

.box-header i {
  font-size: 1.2em;
}

.box-header button {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  border: none !important;
}

.box-header button:hover {
  background: rgba(255, 255, 255, 0.3) !important;
}

/* Messages List */
.messages-list {
  max-height: 700px;
  overflow-y: auto;
  padding: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  color: #bdc3c7;
  text-align: center;
}

.empty-state i {
  margin-bottom: 20px;
  color: #ecf0f1;
}

.empty-state p {
  font-size: 1.2em;
  margin: 0;
  color: #95a5a6;
}

.empty-state small {
  color: #bdc3c7;
  margin-top: 8px;
}

.message-item {
  border-bottom: 1px solid #ecf0f1;
  padding: 20px 24px;
  transition: all 0.3s ease;
  background: white;
}

.message-item:hover {
  background: #f8f9fa;
}

.message-item.unread {
  background: linear-gradient(135deg, #fff5e6 0%, #fff8f0 100%);
  border-left: 4px solid #f39c12;
}

.message-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 12px;
}

.message-title h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.05em;
  font-weight: 600;
  word-break: break-word;
}

.message-date {
  font-size: 0.85em;
  color: #95a5a6;
  white-space: nowrap;
  flex-shrink: 0;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 0.95em;
  color: #7f8c8d;
}

.from-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.role-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #e74c3c;
  color: white;
}

.role-badge.staff {
  background: #3498db;
  color: white;
}

.message-body {
  color: #2c3e50;
  line-height: 1.6;
  margin-bottom: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.95em;
}

.message-footer {
  display: flex;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid #ecf0f1;
}

.message-footer button {
  font-size: 0.85em;
}

/* Compose Form */
.compose-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.compose-form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
  font-size: 0.95em;
}

.required {
  color: #e74c3c;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.95em;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.full-width {
  width: 100%;
}

.compose-textarea {
  resize: vertical;
  min-height: 120px;
}

.char-count {
  font-size: 0.8em;
  color: #95a5a6;
  margin-top: 4px;
}

.compose-form .ui.button {
  margin-top: auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 12px 24px !important;
  border-radius: 6px !important;
  transition: all 0.3s ease !important;
}

.compose-form .ui.button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3) !important;
}

.compose-form .ui.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Scrollbar */
.messages-list::-webkit-scrollbar {
  width: 8px;
}

.messages-list::-webkit-scrollbar-track {
  background: #ecf0f1;
}

.messages-list::-webkit-scrollbar-thumb {
  background: #bdc3c7;
  border-radius: 4px;
}

.messages-list::-webkit-scrollbar-thumb:hover {
  background: #95a5a6;
}

/* Responsive */
@media (max-width: 1024px) {
  .messages-content {
    grid-template-columns: 1fr;
  }

  .messages-sidebar {
    grid-row: 1;
  }

  .messages-main {
    grid-row: 2;
  }
}

@media (max-width: 768px) {
  .messages-wrapper {
    padding: 15px 10px;
  }

  .messages-header h1 {
    font-size: 1.8em;
  }

  .message-header-row {
    flex-direction: column;
  }

  .message-date {
    align-self: flex-start;
  }

  .messages-list {
    max-height: none;
  }

  .box-header {
    padding: 14px 16px;
    font-size: 1em;
  }
}
</style>