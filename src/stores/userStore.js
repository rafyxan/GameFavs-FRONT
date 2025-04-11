import { defineStore } from "pinia";

// This store manages the user state, including username and userId
export const useUserStore = defineStore("user", {
    state: () => ({
        username: null,
        userId: null,
    }),
    actions: {
        setUser(username) {
            this.username = username;
        },
        setUserId(id) {
            this.userId = id;
        },
    },
});