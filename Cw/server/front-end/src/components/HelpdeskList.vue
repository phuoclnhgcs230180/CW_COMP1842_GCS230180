<template>
  <div class="helpdesk-page">
    <div class="ui raised segment page-header">
      <h2 class="ui header page-title">
        System Overview
        <div class="sub header">Manage incidents and standard responses</div>
      </h2>

      <div class="ui stackable three statistics custom-statistics">
        <div class="statistic">
          <div class="value"><i class="database icon"></i> {{ responses.length }}</div>
          <div class="label">Total Issues</div>
        </div>
        <div class="statistic">
          <div class="value"><i class="star yellow icon"></i> {{ commonCount }}</div>
          <div class="label">Common Issues</div>
        </div>
        <div class="statistic">
          <div class="value">
            <button v-if="role === 'admin'" @click="createNew" class="ui teal labeled icon button add-button" title="Add issue">
              <i class="plus icon"></i>
              Add Issue
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="ui raised segment page-content">
      <div class="ui stackable grid controls-row">
        <div class="eight wide column middle aligned">
          <h3 class="ui header" style="margin: 0;">Issue List</h3>
        </div>
        <div class="eight wide column right aligned">
          <div class="ui left icon input search-field">
            <input type="text" v-model="search" @input="onSearch" placeholder="Search issues...">
            <i class="search icon"></i>
          </div>
        </div>
      </div>

      <div v-if="loading" class="ui active dimmer">
        <div class="ui loader"></div>
      </div>

      <div class="table-scroll-wrapper">
        <table v-if="!loading" class="ui selectable celled stackable table response-table">
          <thead class="full-width">
            <tr>
              <th style="min-width: 160px;">Issue Code</th>
              <th style="min-width: 300px;">Detailed Description</th>
              <th style="min-width: 320px;">Standard Response</th>
              <th v-if="role === 'admin'" class="center aligned" style="min-width: 180px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="res in responses" :key="res._id" :class="{ positive: res.isCommon }">
              <td>
                <div class="issue-label">
                  <div class="ui ribbon label teal">{{ res.issueCode }}</div>
                  <i :class="res.isCommon ? 'star yellow icon' : 'star outline grey icon'"></i>
                </div>
              </td>
              <td class="text-cell">{{ res.description }}</td>
              <td class="text-cell">{{ res.responseText }}</td>
              <td v-if="role === 'admin'" class="center aligned action-cell">
                <div class="action-buttons">
                  <router-link :to="{ name: 'edit', params: { id: res._id } }" class="ui blue button edit-button" title="Edit">
                    <i class="edit icon"></i>
                    Edit
                  </router-link>
                  <button @click="deleteItem(res._id)" class="ui red button delete-button" title="Delete">
                    <i class="trash icon"></i>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="responses.length === 0 && !loading">
              <td :colspan="role === 'admin' ? 4 : 3" class="center aligned no-records-row">
                <i class="inbox huge grey icon"></i>
                <p>No records yet. Please add a new issue.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="error" class="ui negative message">
        <i class="close icon"></i>
        <div class="header">Data Load Error</div>
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../api';
export default {
  data() {
    return {
      responses: [],
      search: '',
      role: localStorage.getItem('role'),
      loading: false,
      error: null,
      searchTimeout: null
    }
  },
  computed: {
    commonCount() {
      return this.responses.filter(r => r.isCommon).length;
    }
  },
  async mounted() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
      return;
    }
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get(`/responses?search=${this.search}`);
        this.responses = res.data;
      } catch (e) {
        console.error("Data load error", e);
        if (e.response && e.response.status === 401) {
          // Token invalid or expired, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          this.$router.push('/login');
          return;
        }
        this.error = "Unable to load data. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    onSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.loadData();
      }, 300);
    },
    createNew() {
      // Route name for adding new issue
      this.$router.push('/new'); 
    },
    async deleteItem(id) {
      if (confirm("Are you sure you want to delete this item?")) {
        try {
          await api.delete(`/responses/${id}`);
          this.loadData();
        } catch (e) {
          console.error("Delete error", e);
          if (e.response && e.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            this.$router.push('/login');
            return;
          }
          this.error = "Unable to delete item. Please try again.";
        }
      }
    }
  }
}
</script>

<style scoped>
.helpdesk-page { padding: 0; }
.page-header { padding: 30px; border-radius: 22px; background: #ffffff; margin-bottom: 24px; }
.page-header .page-title { margin-bottom: 1.5rem !important; }
.custom-statistics .statistic { min-width: 180px; }
.add-button { min-width: 140px; }
.page-content { padding: 28px; border-radius: 22px; background: #ffffff; }
.controls-row { margin-bottom: 22px; }
.search-field input { min-width: 240px; border-radius: 999px !important; }
.response-table { margin-top: 20px; border-collapse: separate !important; }
.response-table th, .response-table td { vertical-align: middle !important; }
.issue-label { display: inline-flex; align-items: center; gap: 0.65rem; }
.issue-label .star.icon { margin-left: 0; }
.action-buttons > * { margin-right: 8px; }
.action-buttons > *:last-child { margin-right: 0; }
.ui.table tbody tr.positive { background: rgba(255, 235, 59, 0.12) !important; }
.ui.table thead th { background: #f8fafc !important; color: #444; }
.ui.table th, .ui.table td { padding: 14px 12px !important; }
.ui.button.icon { width: 44px; }
.ui.message { margin-top: 18px; }
.table-scroll-wrapper {
  margin-top: 20px;
  max-height: 520px;
  border: 1px solid #e6ecf2;
  border-radius: 18px;
  overflow-y: auto;
  background: #ffffff;
}
.table-scroll-wrapper::-webkit-scrollbar {
  width: 10px;
}
.table-scroll-wrapper::-webkit-scrollbar-track {
  background: #f4f6f8;
  border-radius: 10px;
}
.table-scroll-wrapper::-webkit-scrollbar-thumb {
  background: #b0bcc9;
  border-radius: 10px;
}
.table-scroll-wrapper::-webkit-scrollbar-thumb:hover {
  background: #8a98a6;
}
.text-cell {
  white-space: pre-wrap;
  word-break: break-word;
}
.action-cell {
  min-width: 180px;
}
.no-records-row {
  padding: 40px 0 !important;
}
@media screen and (max-width: 992px) {
  .table-scroll-wrapper { max-height: 420px; }
}
@media screen and (max-width: 768px) {
  .table-scroll-wrapper { max-height: 360px; }
  .custom-statistics .statistic { min-width: auto; }
  .add-button { width: 100% !important; }
  .search-field { width: 100%; }
  .search-field input { width: 100%; }
}
</style>