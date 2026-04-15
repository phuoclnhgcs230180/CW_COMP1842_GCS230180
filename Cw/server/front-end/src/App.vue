<template>
  <div id="app" class="dashboard-layout">
    <div v-if="role" class="ui visible inverted left vertical sidebar menu custom-sidebar">
      <div class="item logo-box">
        <h2 class="ui teal inverted header">
          <i class="desktop icon"></i>
          <div class="content">IT Helpdesk<div class="sub header"> Portal</div></div>
        </h2>
      </div>
      
      <router-link to="/responses" class="item"><i class="chart pie icon"></i> Overview (Dashboard)</router-link>
      <router-link v-if="role === 'admin'" to="/register" class="item"><i class="users icon"></i> Staff Management</router-link>
      <router-link to="/messages" class="item"><i class="envelope icon"></i> Messages</router-link>
      <router-link to="/change-password" class="item"><i class="key icon"></i> Change Password</router-link>
      
      <div class="bottom-menu">
        <button class="ui inverted red fluid button" @click="logout">
          <i class="sign out alternate icon"></i> Logout
        </button>
      </div>
    </div>

    <div :class="['pusher main-content', { 'full-width': !role }]">
      <div v-if="role" class="ui borderless menu topbar">
        <div class="right menu">
          <div class="item">
            <img class="ui avatar image" src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff">
            <span>Hello, <strong>{{ username }}</strong> ({{ role }})</span>
          </div>
        </div>
      </div>

      <div class="ui container fluid content-wrapper">
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      role: localStorage.getItem('role'),
      username: localStorage.getItem('username')
    }
  },
  watch: {
    '$route'() { 
      this.role = localStorage.getItem('role');
      this.username = localStorage.getItem('username') || 'User';
    }
  },
  methods: {
    logout() {
      if (confirm("Are you sure you want to logout?")) {
        localStorage.clear(); // Clear token and role
        this.$router.push('/login'); // Return to login page
        window.location.reload(); // Refresh to update UI
      }
    }
  }
};
</script>

<style>
/* CSS magic to make Semantic UI look more modern */
body { background-color: #eef2f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
.dashboard-layout { display: flex; min-height: 100vh; background: #eef2f5; }

/* Sidebar Styling */
.custom-sidebar { width: 260px !important; background: #1b1c1d !important; display: flex; flex-direction: column; }
.logo-box { padding: 28px 20px !important; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 10px; }
.custom-sidebar .item { font-size: 1rem; padding: 16px 22px !important; color: rgba(255,255,255,0.85) !important; }
.custom-sidebar .item:hover, .custom-sidebar .item.active { background: rgba(0,181,173,0.12) !important; color: #fff !important; }
.bottom-menu { margin-top: auto; padding: 24px 20px 28px; border-top: 1px solid rgba(255,255,255,0.08); }
.bottom-menu .button { width: 100%; }

/* Main Content Styling */
.main-content { flex: 1; display: flex; flex-direction: column; margin-left: 260px; min-height: 100vh; overflow-y: auto; transition: margin 0.3s ease; }
.main-content.full-width { margin-left: 0; }
.topbar { margin: 0 !important; border-radius: 0 !important; border-bottom: 1px solid #e0e1e2 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important; padding: 10px 24px; background: white !important; }
.content-wrapper { padding: 30px !important; max-width: 1200px !important; margin: 20px auto !important; background: #ffffff !important; border-radius: 20px !important; box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08) !important; }

/* Box shadow for cards */
.ui.segment, .ui.cards > .card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; border: none !important; border-radius: 12px !important; }

@media screen and (max-width: 900px) {
  .custom-sidebar { display: none !important; }
  .main-content { margin-left: 0 !important; }
  .topbar { padding: 12px 16px !important; }
  .content-wrapper { margin: 10px !important; padding: 22px !important; }
}
</style>