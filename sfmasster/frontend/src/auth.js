// Authentication and User Management for SFMasster
export class AuthService {
  constructor() {
    this.currentUser = this.getCurrentUser();
  }

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('sfmasster_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Save user to localStorage
  saveUser(user) {
    localStorage.setItem('sfmasster_user', JSON.stringify(user));
    this.currentUser = user;
  }

  // Login with email
  async login(email, password) {
    try {
      // Simulate API call - in real app, this would call your auth service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=f97316&color=fff&size=40`,
        completedChallenges: this.getCompletedChallenges(email),
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };

      this.saveUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign up with email
  async signup(email, password, name) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        name: name || email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${name || email.split('@')[0]}&background=f97316&color=fff&size=40`,
        completedChallenges: [],
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };

      this.saveUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('sfmasster_user');
    this.currentUser = null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get completed challenges for a user
  getCompletedChallenges(email) {
    const completed = localStorage.getItem(`completed_${email}`);
    return completed ? JSON.parse(completed) : [];
  }

  // Mark challenge as completed
  markChallengeCompleted(challengeId) {
    if (!this.currentUser) return;
    
    const completed = this.getCompletedChallenges(this.currentUser.email);
    if (!completed.includes(challengeId)) {
      completed.push(challengeId);
      localStorage.setItem(`completed_${this.currentUser.email}`, JSON.stringify(completed));
      
      // Update current user's completed challenges
      this.currentUser.completedChallenges = completed;
      this.saveUser(this.currentUser);
    }
  }

  // Get total completed challenges count
  getCompletedCount() {
    return this.currentUser ? this.currentUser.completedChallenges.length : 0;
  }

  // Get active users count (simulated)
  getActiveUsersCount() {
    // Simulate active users count
    return Math.floor(Math.random() * 1000) + 2000;
  }
}

// Create singleton instance
export const authService = new AuthService();