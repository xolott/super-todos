<template>
  <div class="signup">
    <div class="signup--wrapper">
      <h2 class="title fw-700">Signup</h2>
      <v-form v-model="valid" ref="form">
        <v-text-field
          v-model="username"
          :rules="[rules.required]"
          type="text"
          name="username"
          label="Username"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.min]"
          :type="showPassword ? 'text' : 'password'"
          name="password"
          label="Password"
          @click:append="showPassword = !showPassword"
          counter
        ></v-text-field>

        <v-btn class="primary" type="submit" @click="submit"
          >Create Account</v-btn
        >
      </v-form>
    </div>
  </div>
</template>

<script>
import { Accounts } from "meteor/accounts-base";

export default {
  name: "signup",
  data: () => ({
    isLoading: false,
    valid: false,
    username: "",
    password: "",
    showPassword: false,
    rules: {
      required: (value) => !!value || "Required",
      min: (v) => v.length >= 8 || "Min 8 characters",
      emailMatch: () => `The email and password you entered don't match`,
    },
  }),
  methods: {
    submit(event) {
      event.preventDefault();

      if (this.$refs.form.validate()) {
        this.isLoading = true;
        Accounts.createUser(
          { username: this.username, password: this.password },
          (error) => {
            if (error) {
              this.$eventBus.$emit("alert", {
                type: "error",
                message: error.reason,
              });
              this.isLoading = false;
            } else {
              this.$router.push({ name: "auth.login" });
            }
          }
        );
      }
    },
  },
};
</script>

<style scoped lang="scss">
.signup {
  height: 100%;
  display: flex;
  &--wrapper {
    margin: auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background-color: white;
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid rgb(204, 204, 204);
    min-width: 400px;
    .title {
      text-align: center;
    }
    .v-form {
      display: flex;
      flex-direction: column;
      .v-btn {
        margin-left: auto;
        margin-top: 0.5rem;
      }
      .v-input {
        margin: 0.5rem 0;
      }
    }
  }
}
</style>
