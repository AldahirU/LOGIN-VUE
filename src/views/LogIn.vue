<template>
    <div class="container">
      <div class="columns">
        <!-- Div para la imagen en el lado izquierdo -->
        <div class="column is-4 is-offset-2"> <!-- Ajusta el ancho y la posición -->
          <img src="/src/assets/images/logo-universidad.JPG" alt="Imagen de inicio de sesión">
        </div>
  
        <div class="column is-4"> <!-- Ajusta el ancho -->
          <h1 class="title">Log In</h1>
                  <form @submit.prevent="submitForm">
                      <div class="field">
                          <label>Correo</label>
                          <div class="control">
                              <input type="email" name="email" class="input" v-model="username">
                          </div>
                      </div>
                      <div class="field">
                          <label>Contraseña</label>
                          <div class="control">
                              <input type="password" name="password" class="input" v-model="password">
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
  </template>
  

<script>
import axios from 'axios';

export default {
    name:'LogIn',
    data(){
        return {
            username:'',
            password:'',
            errors:[]
        }

    },
    methods:{
        async submitForm(){
            this.$store.commit('setIsLoading',true)

            axios.defaults.headers.common['Authorization']=''
            localStorage.removeItem('token')

            const formData ={
                username:this.username,
                password:this.password,
            }
            await axios
                .post('api/v1/token/login', formData)
                .then(response =>{
                    const token= response.data.auth_token;
                    console.log(token);
                    console.log(token)


                    this.$store.commit('setToken',token)

                    axios.defaults.headers.common['Authorization'] = 'Token ' + token
                    localStorage.setItem('token', token)
                })
                .catch(error => {
                    if (error.response){
                        for (const property in error.response.data){
                            this.errors.push(`${property}: ${error.response.data[property]}`)
                        } 
                    }else if(error.message){
                        console.log(":::::::::::",error)
                        this.errors.push('Verifica tus credenciales')
                    }
                })
                
            await axios
                .get('api/v1/users/me')
                .then(response =>{
                    this.$store.commit('setUser',{'id':response.data.id, 'username':response.data.username})
                    
                    localStorage.setItem('username',response.data.username)
                    localStorage.setItem('userid',response.data.id)
                    // console.log(username);
                    this.$router.push('/dashboard/myaccount')
                })
                .catch(error =>{
                        console.log(error);
                })
 
            await axios
                .get('api/v1/teams/get_my_team')
                .then(response =>{
                    console.log(response.data);
                    this.$store.commit('setTeam',{
                        'id':response.data.id,
                        'name':response.data.name,
                        'plan':response.data.plan.name,
                        'max_leads':response.data.plan.max_leads,
                        'max_clients':response.data.plan.max_clients
                    
                    });
                })
                .catch(error =>{
                        console.log(error);
                })

            this.$store.commit('setIsLoading',false)

        }
},
}
</script>

<style scoped>
.column.is-offset-2 {
  margin-left: 10;
}

.column.is-4 {
    padding: 90px;
}
</style>
