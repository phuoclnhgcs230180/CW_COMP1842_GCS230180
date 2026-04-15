<template>
  <div class="page-container">
    <div class="page-header-card">
      <div>
        <h1>Add New Response</h1>
        <p>Create a new issue response template for support staff to use.</p>
      </div>
      <div class="header-badge">Issue Management</div>
    </div>

    <div class="ui raised segment page-segment">
      <response-form @createOrUpdate="createResponse"></response-form>
    </div>
  </div>
</template>

<script>
import ResponseForm from './ResponseForm.vue';
import { api } from '../api.js';

export default {
  name: 'NewResponse',
  components: {
    'response-form': ResponseForm
  },
  methods: {
    async createResponse(responseItem) {
      try {
        await api.post('/responses', responseItem);
        this.$router.push('/responses');
      } catch (error) {
        console.error("Create error:", error);
        alert('An error occurred while saving the response. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.page-container { padding-top: 18px; }
.page-header-card { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; padding: 24px 28px; background: linear-gradient(135deg, #1d8cf8 0%, #3358ff 100%); border-radius: 20px; color: #fff; }
.page-header-card h1 { margin: 0 0 6px; font-size: 2rem; }
.page-header-card p { margin: 0; color: rgba(255,255,255,0.92); }
.header-badge { background: rgba(255,255,255,0.12); padding: 10px 18px; border-radius: 999px; font-weight: 600; letter-spacing: 0.02em; }
.page-segment { padding: 30px; border-radius: 22px; }
</style>