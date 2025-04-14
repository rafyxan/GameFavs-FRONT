import { defineStore } from "pinia";

// Esto almacena el estado del usuario, incluyendo el nombre de usuario y el ID del usuario
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