<template>
  <div class="page-container">
    <div class="page-header-card edit-header-card">
      <div>
        <h1>Edit Response</h1>
        <p>Update the issue details or standard resolution content for support staff.</p>
      </div>
      <button class="ui basic inverted button" @click="$router.push('/responses')">Back to List</button>
    </div>

    <div class="ui raised segment page-segment">
      <response-form :responseItem="responseItem" @createOrUpdate="updateResponse"></response-form>
    </div>
  </div>
</template>

<script>
import ResponseForm from './ResponseForm.vue';
import { api } from '../api.js';

export default {
  name: 'EditResponse',
  components: {
    'response-form': ResponseForm
  },
  data() {
    return {
      responseItem: {} // Store existing response data
    };
  },
  async mounted() {
    try {
      const res = await api.get(`/responses/${this.$route.params.id}`);
      this.responseItem = res.data;
    } catch (error) {
      console.error("Error loading existing data:", error);
    }
  },
  methods: {
    async updateResponse(responseItem) {
      try {
        await api.put(`/responses/${this.$route.params.id}`, responseItem);
        this.$router.push('/responses');
      } catch (error) {
        console.error("Update error:", error);
        alert('Unable to update the response. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.page-container { padding-top: 18px; }
.page-header-card { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 24px; padding: 24px 28px; background: linear-gradient(135deg, #ff6b6b 0%, #ff8c42 100%); border-radius: 20px; color: #fff; }
.page-header-card h1 { margin: 0 0 6px; font-size: 2rem; }
.page-header-card p { margin: 0; color: rgba(255,255,255,0.92); }
.page-segment { padding: 30px; border-radius: 22px; }
.ui.basic.inverted.button { border: 1px solid rgba(255,255,255,0.24) !important; color: white !important; }
</style>