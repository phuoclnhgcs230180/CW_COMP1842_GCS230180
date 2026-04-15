<template>
  <form class="ui form response-form" @submit.prevent="onSubmit">
    <div class="section-block">
      <h3>Issue Details</h3>
      <div class="field">
        <label>Issue Code</label>
        <input type="text" v-model="response.issueCode" placeholder="Example: PWD_RESET" required />
      </div>
      <div class="field">
        <label>Detailed Description</label>
        <textarea v-model="response.description" placeholder="Describe the issue clearly..." rows="3" required></textarea>
      </div>
    </div>

    <div class="section-block">
      <h3>Response Guidance</h3>
      <div class="field">
        <label>Standard Response</label>
        <textarea v-model="response.responseText" placeholder="Enter the resolution steps or message..." rows="3" required></textarea>
      </div>
      <div class="field checkbox-field">
        <div class="ui toggle checkbox">
          <input type="checkbox" id="isCommon" v-model="response.isCommon">
          <label for="isCommon">Mark as common issue</label>
        </div>
        <div class="hint-text">Common issues are highlighted in the dashboard and public portal.</div>
      </div>
    </div>

    <button class="ui fluid large primary button" type="submit">Save Response</button>
  </form>
</template>

<script>
export default {
  name: 'ResponseForm',
  props: {
    responseItem: {
      type: Object,
      default: () => ({ issueCode: '', description: '', responseText: '' })
    }
  },
  data() {
    return {
      response: {
        issueCode: '',
        description: '',
        responseText: '',
        isCommon: false
      }
    };
  },
  watch: {
    responseItem: {
      handler(newVal) {
        this.response = { ...this.response, ...newVal };
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    onSubmit() {
      this.$emit('createOrUpdate', this.response);
    }
  }
};
</script>

<style scoped>
.response-form { display: grid; gap: 22px; }
.section-block { background: #f8fbff; border: 1px solid #e6eef9; border-radius: 18px; padding: 22px; }
.section-block h3 { margin: 0 0 16px; font-size: 1.1rem; color: #243b55; }
.ui.form .field label { font-weight: 600; color: #2c3e50; }
.ui.form input, .ui.form textarea, .ui.form select { border-radius: 14px !important; border: 1px solid #d8e2ef !important; }
.ui.form .field input:focus, .ui.form .field textarea:focus { border-color: #667eea !important; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.12) !important; }
.checkbox-field { display: grid; gap: 10px; }
.hint-text { font-size: 0.9rem; color: #6c7a89; margin-top: 6px; }
.ui.form .ui.primary.button { margin-top: 0.5rem; border-radius: 999px !important; padding: 16px 0 !important; font-size: 1rem; }
</style>