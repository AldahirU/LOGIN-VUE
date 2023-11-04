<template>
  <div class="container">
    <div class="columns">
      <!-- Div para la imagen en el lado izquierdo -->
      <div class="column is-6">
        <!-- Se ajusta al ancho deseado -->
        <img src="/src/assets/images/logo-uninter.png" alt="milton" />
      </div>

      <!-- Div para el formulario en el lado derecho -->
      <div class="column is-6">
        <!-- Se ajusta al ancho deseado -->
        <div class="is-offset-2">
          <!-- Opcional: Agrega un espacio a la izquierda -->
          <h1 class="title">Sign up</h1>

          <form @submit.prevent="submitForm">
            <div class="field">
              <label>Email</label>
              <div class="control">
                <input
                  type="email"
                  name="email"
                  class="input"
                  v-model="username"
                />
              </div>
            </div>
            <div class="field">
              <label>Password</label>
              <div class="control">
                <input
                  type="password"
                  name="password1"
                  class="input"
                  v-model="password1"
                />
              </div>
            </div>
            <div class="field">
              <label>Confirm Password</label>
              <div class="control">
                <input
                  type="password"
                  name="password2"
                  class="input"
                  v-model="password2"
                />
              </div>
            </div>
            <div class="notification is-danger" v-if="errors.length">
              <p v-for="error in errors" :key="error">{{ error }}</p>
            </div>
            <div class="field">
              <div class="control">
                <button class="button is-success">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "bulma-toast";
export default {
  name: "SignUp",
  data() {
    return {
      username: "",
      password1: "",
      password2: "",
      errors: [],
    };
  },
  methods: {
    async submitForm() {
      this.errors = [];

      if (this.username === "") {
        this.errors.push("Registra un correo válido");
      }
      if (this.password1 === "") {
        this.errors.push("La contraseña no puede estar vacía");
      }
      if (this.password1 !== this.password2) {
        this.errors.push("Las contraseñas no coinciden");
      }
      if (!this.errors.length) {
        this.$store.commit("setIsLoading", true);
        const formData = {
          username: this.username,
          password: this.password1,
        };
        await axios
          .post("/api/v1/users/", formData)
          .then((response) => {
            toast({
              message: "Account has been created please log-in",
              type: "is-success",
              dismissible: true,
              pauseOnHover: true,
              duration: 2000,
              position: "bottom-right",
            });
            this.$router.push("/log-in");
          })
          .catch((error) => {
            if (error.response) {
              for (const property in error.response.data) {
                this.errors.push(
                  `${property}: ${error.response.data[property]}`
                );
              }
            } else if (error.message) {
              this.errors.push("somthing went wrong please try again");
            }
          });
        this.$store.commit("setIsLoading", false);
      }
    },
  },
};
</script>
