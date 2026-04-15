<template>
  <div>
    <div class="ui grid">
      <div class="eight wide column"><h2>Helpdesk Library</h2></div>
      <div class="eight wide column right aligned">
        <div class="ui icon input">
          <input type="text" v-model="search" @input="onSearch" placeholder="Search code or description...">
          <i class="search icon"></i>
        </div>
      </div>
    </div>

    <table class="ui celled table">
      <thead>
        <tr>
          <th>Issue Code</th>
          <th>Description</th>
          <th>Standard Response</th>
          <th v-if="role === 'admin'">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="res in responses" :key="res._id">
          <td><div class="ui label teal">{{ res.issueCode }}</div></td>
          <td>{{ res.description }}</td>
          <td>{{ res.responseText }}</td>
          <td v-if="role === 'admin'">
            <router-link :to="{name: 'edit', params: {id: res._id}}">Edit</router-link> |
            <a href="#" @click.prevent="deleteItem(res._id)">Delete</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { api } from '../api';
export default {
  data() {
    return { responses: [], search: '', role: localStorage.getItem('role') }
  },
  async mounted() { this.loadData(); },
  methods: {
    async loadData() {
      const res = await api.get(`/responses?search=${this.search}`);
      this.responses = res.data;
    },
    onSearch() { this.loadData(); },
    async deleteItem(id) {
      if (confirm("Delete this?")) {
        await api.delete(`/responses/${id}`);
        this.loadData();
      }
    }
  }
}
</script>