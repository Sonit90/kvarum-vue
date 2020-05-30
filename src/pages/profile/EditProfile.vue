<template>
  <div
    class="flex flex-center"
    :class="{'q-my-lg':$q.screen.gt.md}"
  >
    <q-card
      class="q-pa-md q-gutter-y-md editProfileCard"
    >
      <q-card-section class="q-py-none">
        <div class="text-h6">
          Редактирование профиля
        </div>
      </q-card-section>

      <q-card-section :class="{'q-pa-md':$q.screen.gt.md,'q-pa-sm q-my-none':$q.screen.lt.md}">
        <ImageUploader
          v-if="editProfile"
          :cropper-show="cropperShow"
          button-caption="Выберите фото"
          :upload-u-r-l="uploadUrl"
          field-name="avatar"
          :form-fields="[{name: 'id', value: editProfile.user_id}]"
          :avatar="avatar"
          @avatarUploaded="avatarUploaded"
        />
      </q-card-section>

      <q-card-section :class="{'q-pa-md':$q.screen.gt.md,'q-pa-sm q-my-none':$q.screen.lt.md}">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab
            name="general"
            label="Основное"
          />
          <q-tab
            name="social"
            label="Соцсети"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels
          v-model="tab"
          animated
        >
          <q-tab-panel
            name="general"
            class="q-gutter-y-md"
            :class="{'q-pa-md':$q.screen.gt.md,'q-pa-sm':$q.screen.lt.md}"
          >
            <q-input
              v-model="editProfile.name"
              :dense="$q.screen.lt.md"
              label="Имя *"
              :error="$v.editProfile.name.$error"
              @blur="$v.editProfile.name.$touch()"
              @input="clearServerError('name')"
            >
              <template v-slot:error>
                <span v-if="!$v.editProfile.name.required">Укажите ваше имя. </span>
                <span v-if="!$v.editProfile.name.minLength">Имя должно быть не короче {{ $v.editProfile.name.$params.minLength.min }} символов</span>
                <span v-if="!$v.editProfile.name.server">{{ errors.get('name').join(' ') }}</span>
              </template>
            </q-input>
            <q-input
              v-model="editProfile.surname"
              :dense="$q.screen.lt.md"
              label="Фамилия *"
              :error="$v.editProfile.surname.$error"
              @blur="$v.editProfile.surname.$touch()"
              @input="clearServerError('surname')"
            >
              <template v-slot:error>
                <span v-if="!$v.editProfile.surname.required">Укажите вашу фамилию. </span>
                <span v-if="!$v.editProfile.surname.server">{{ errors.get('surname').join(' ') }}</span>
              </template>
            </q-input>
            <q-select
              v-model="editProfile.location"
              :dense="$q.screen.lt.md"
              label="Город"
              clearable
              hide-selected
              use-input
              fill-input
              input-debounce="200"
              :options="citiesOpts"
              hint="Введите 3 символа для поиска"
              @filter="filterCity"
              @input="clearServerError('locality')"
              @blur="$v.editProfile.location.$touch()"
            >
              <template v-slot:error>
                <span v-if="!$v.editProfile.location.server">{{ errors.get('locality').join(' ') }}</span>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Город не найден
                  </q-item-section>
                </q-item>
              </template>
            </q-select>


            <!--            <q-input-->
            <!--              v-model="editProfile.location"-->
            <!--              :dense="$q.screen.lt.md"-->
            <!--              label="Город"-->
            <!--              :error="$v.editProfile.location.$error"-->
            <!--              @blur="$v.editProfile.location.$touch()"-->
            <!--              @input="clearServerError('locality')"-->
            <!--            >-->
            <!--              <template v-slot:error>-->
            <!--                <span v-if="!$v.editProfile.location.server">{{ errors.get('locality').join(' ') }}</span>-->
            <!--              </template>-->
            <!--            </q-input>-->

            <q-input
              v-model="editProfile.public_email"
              :dense="$q.screen.lt.md"
              type="email"
              label="Публичный email"
              hint="Этот электронный адрес будет показываться другим пользователям"
              :error="$v.editProfile.public_email.$error"
              autocomplete="new-email"
              @blur="$v.editProfile.public_email.$touch()"
              @input="clearServerError('email')"
            >
              <template v-slot:error>
                <span v-if="!$v.editProfile.public_email.required">Укажите адрес электронной почты. </span>
                <span v-if="!$v.editProfile.public_email.email">Укажите подходящий адрес электронной почты </span>
                <span v-if="!$v.editProfile.public_email.server">{{ errors.get('email').join(' ') }}</span>
              </template>
            </q-input>
            <q-field
              :error="$v.editProfile.phone_mobile.$error"
              borderless
              no-error-icon
              :dense="$q.screen.lt.md"
            >
              <VuePhoneNumberInput
                v-model="editProfile.phone_mobile"
                :error="$v.editProfile.phone_mobile.$error"
                class="full-width"
                no-flags
                no-country-selector
                :border-radius="0"
                default-country-code="RU"
                :translations="{phoneNumberLabel: 'Номер телефона',example: 'Пример: '}"
                @update="phoneUpdate"
                @phone-number-blur="blurPhone"
              />
              <template #error>
                <span v-if="!$v.editProfile.phone_mobile.phone">Укажите телефон в формате +7 966 555 15 15</span>
                <span v-if="!$v.editProfile.phone_mobile.server">{{ errors.get('phone_mobile').join(' ') }}</span>
              </template>
            </q-field>

            <q-btn-toggle
              v-model="editProfile.type"
              no-caps
              push
              spread
              class="custom-spread "
              :class="{'column q-my-sm':$q.screen.lt.md}"
              toggle-color="primary"
              :options="userTypes"
            />

            <ChooseAgency
              v-model="editProfile.agency_id"
              :disabled="editProfile.type!=='agencyAgent'"
              :error="$v.editProfile.agency_id.$error"
              @blur="$v.editProfile.agency_id.$touch()"
            >
              <template v-slot:after>
                <q-avatar
                  color="primary"
                  text-color="white"
                  icon="fas fa-question"
                  size="md"
                >
                  <q-tooltip max-width="300px">
                    <p class="text-body1 q-ma-none">
                      Агентство будет изменено после одобрения модератором
                    </p>
                  </q-tooltip>
                </q-avatar>
              </template>
            </ChooseAgency>
            <q-input
              v-model="editProfile.about"
              label="О себе"
              :dense="$q.screen.lt.md"
              type="textarea"
              counter
              autogrow
              :error="$v.editProfile.about.$error"
              maxlength="150"
              @blur="$v.editProfile.about.$touch()"
              @input="clearServerError('about')"
            >
              <template v-slot:error>
                <span v-if="!$v.editProfile.about.maxength">О себе не должно превышать {{ $v.editProfile.about.$params.maxLength.max }} символов</span>
                <span v-if="!$v.editProfile.about.server">{{ errors.get('about').join(' ') }}</span>
              </template>
            </q-input>
          </q-tab-panel>

          <q-tab-panel
            name="social"
            :class="{'q-pa-md':$q.screen.gt.md,'q-pa-sm':$q.screen.lt.md}"
          >
            <q-input
              v-for="social in socials"
              :key="social.name"
              v-model="editProfile[social.name]"
              class="social-input"
              :label="cap(social.name)"
              :error="$v.editProfile[social.name].$error"
              clearable
              @blur="$v.editProfile[social.name].$touch()"
              @input="clearServerError(social.name)"
            >
              <template v-slot:prepend>
                <q-icon
                  class="q-pa-md rounded-borders"
                  :name="social.icon"
                  :class="social.name"
                />
              </template>
              <template v-slot:error>
                <span v-if="!$v.editProfile[social.name].url"> Неправильный формат ссылки </span>
                <span v-if="!$v.editProfile[social.name].server">{{ errors.get(social.name).join(' ') }}</span>
              </template>
            </q-input>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions>
        <q-btn
          outline
          label="Сохранить"
          :loading="processing"
          :disable="processing"
          icon-right="send"
          color="primary"
          @click="edit"
        />
        <q-btn
          outline
          label="Отмена"
          class="q-px-md"
          :disable="processing"
          :to="'/profile'"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
  import {email, minLength,maxLength, required, requiredIf, url	} from 'vuelidate/lib/validators'
  import serverError from 'src/mixins/serverError'
  import {mapFields} from 'vuex-map-fields'
  import ChooseAgency from "components/agencies/ChooseAgency"
  import VuePhoneNumberInput from 'vue-phone-number-input';
  import 'vue-phone-number-input/dist/vue-phone-number-input.css';
  import ImageUploader from "pages/profile/ImageUploader";
  import { format } from 'quasar'
  const { capitalize } = format

  export default {
        name: "EditProfile",
      components: {ImageUploader, ChooseAgency, VuePhoneNumberInput},
      mixins:[serverError],
      computed: {
          ...mapFields(
          'auth',
          ['profile',
            'profile.avatar',
            'userTypes'
          ]
        ),
        ...mapFields(
          'flats',
          ['cities']
        ),
        uploadUrl(){
          return process.env.API + 'profile/upload-avatar/'
        },
        citiesOptions(){
          let cities= this.cities.map(function(el) {
            return el.city;
          });
          cities.sort()
            return Object.freeze(cities)
        }
      },

      data () {
        return {
          editProfile:null,
          citiesOpts:this.citiesOptions,
          tab:'general',
          formattedPhone:null,
          processing:false,
          cropperShow: true,
          phoneValid:false,
          image: null,
          socials:[
        {name:'whatsapp', icon:'fab fa-whatsapp'},
        {name:'vk', icon:'fab fa-vk'},
        {name:'instagram', icon:'fab fa-instagram'},
        {name:'facebook', icon:'fab fa-facebook-f'},
        {name:'twitter', icon:'fab fa-twitter'},
        {name:'youtube', icon:'fab fa-youtube'}
      ]
        }
      },
    created() {
    this.editProfile=  JSON.parse(JSON.stringify(this.profile))
          },
    methods:{
          cap(str){
            return capitalize(str)
          },
      filterCity(val, update, abort){
        if (val.length < 3) {
          abort()
          return
        }
          update(() => {
            const needle = val.toLowerCase()
            this.citiesOpts = this.citiesOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
          })
      },
        avatarUploaded(url){
          console.log(url)
          this.avatar=url
          this.$q.notify('Аватар успешно загружен')
          //TODO Update avatar path in global array of profiles???
        },
        phoneUpdate(value){
          this.phoneValid=value.isValid
          this.formattedPhone=value.formatInternational
        },
        blurPhone(){
          this.editProfile.phone_mobile=this.formattedPhone
          this.$v.editProfile.phone_mobile.$touch()
        },
        edit(){
          this.$v.editProfile.$touch()
          if (this.$v.editProfile.$invalid) {
            return
          }
          this.processing = true

          this.$store.dispatch('auth/editProfile', this.editProfile).then(response => {
            console.log(response)
            this.$q.notify('Профиль успешно отредактирован')
            this.$router.push('/profile')
          })
            .catch((err) => {
              console.log(err)
              console.log(err.response)
              this.$q.notify(err.response.data.message)
              this.collectErrors(err.response.data.errors)
            })
            .finally(()=>{
              this.processing = false
            })
        }
        },
      validations: {
        editProfile: {
          agency_id: {
            requiredIf: requiredIf(function() {
              return this.editProfile.type === 'agencyAgent'
            })
          },
          public_email: {
            email,
            server: function () {
              return !this.hasServerError('public_email')
            }
          },
          name: {
            minLength: minLength(2),
            required,
            server: function () {
              return !this.hasServerError('name')
            }
          },
          surname: {
            required,
            server: function () {
              return !this.hasServerError('surname')
            }
          },
          phone_mobile:{
            phone:function(){
              return this.phoneValid
            },
            server: function () {
              return !this.hasServerError('phone_mobile')
            }
          },
          location:{
            server: function () {
              return !this.hasServerError('location')
            }
          },
          about:{
            maxLength: maxLength(150),
            server: function () {
              return !this.hasServerError('about')
            }
          },
          whatsapp:{
            server: function () {
              return !this.hasServerError('whatsapp')
            }
          },
          vk:{
            url:url,
            server: function () {
              return !this.hasServerError('vk')
            }
          },
          instagram:{
            url:url,
            server: function () {
              return !this.hasServerError('instagram')
            }
          },
          facebook:{
            url:url,
            server: function () {
              return !this.hasServerError('facebook')
            }
          },
          twitter:{
            url:url,
            server: function () {
              return !this.hasServerError('twitter')
            }
          },
          youtube:{
            url:url,
            server: function () {
              return !this.hasServerError('youtube')
            }
          },

        }

      }
    }
</script>
<style lang="stylus">
  .custom-spread button:first-child
    flex: 18000 1 0%
</style>
<style scoped>
  .editProfileCard{
    width: 700px; max-width: 80vw;
  }
  @media (max-width: 425px){
    .editProfileCard{max-width: 100vw;
    }
  }
  .social-input .facebook {
    background: #3B5998;
    color: white;
  }

  .social-input .twitter {
    background: #55ACEE;
    color: white;
  }

  .social-input .vk {
    background: #4a76a8;
    color: white;
  }
  .social-input .whatsapp {
    background: #0cb757;
    color: white;
  }

  .social-input .youtube {
    background: #b00202;
    color: white;
  }

  .social-input .instagram {
    background: #d93175;
    color: white;
  }
</style>
