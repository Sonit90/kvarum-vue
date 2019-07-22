<template>
    <div class="q-pa-md">
        <q-card class="login-card"   style="max-width: 600px; min-width:360px;">
            <q-form
                    @submit="createTicket"
                    class="q-gutter-md"
            >
            <q-select v-model="section" :options="categoryOptions" label="Категория" />

                <q-option-group
                        :options="priorityOptions"
                        label="Приоритет"
                        type="radio"
                        v-model="priority"
                />
                <q-date
                        v-model="finishDue" mask="DD/MM/YYYY"  today-btn
                />
                <q-input v-model="title" label="Заголовок" >
                    <template v-slot:prepend>
                        <q-icon name="title" />
                    </template>
                </q-input>
                <q-input
                        v-model="description"
                        filled
                        type="textarea"
                        label="Описание"
                >
                    <template v-slot:prepend>
                        <q-icon name="short_text
" />
                    </template>
                </q-input>
<!--                <q-datetime-picker v-model="model" type="date" />-->
<!--                <q-datetime-picker v-model="finishDue" type="date" />-->

<!--                <q-datetime-picker today-btn now-btn label="Standard Date Picker" mode="datetime" v-model="finishDue"></q-datetime-picker>-->

            </q-form>
        </q-card>
    </div>
</template>

<script>
import { Notify, date } from 'quasar'

export default {
  name: 'CreateTicket',
  data () {
    // const { addToDate } = date
    let finishDueDate = date.formatDate(date.addToDate(new Date(), { days: 1 }), 'DD/MM/YYYY')
    console.log(finishDueDate)
    return {
      section: '',
      priority: 1,
      finishDue: finishDueDate,
      title: '',
      description: '',
      categoryOptions:
        ['Проблема с компьютером', 'Проблема с печатью', 'Проблема с интернетом/сетью', 'Проблема с сервером', 'Проблема с видеонаблюдением', 'Проблема с сайтом', 'Заказ на заправку', 'Заказ на ремонт'],
      priorityOptions: [{
        label: 'Нормальный', value: 1
      },
      {
        label: 'Средний',
        value: 2
      },
      {
        label: 'Высокий',
        value: 3
      }]

    }
  },
  methods: {
    createTicket () {
      const { priority, finishDue, title, description } = this
      const section = this.categoryOptions[this.section]
      this.$store.dispatch('mystore/createTicket', {
        section,
        priority,
        finishDue,
        title,
        description
      }).then(() => {
        // this.processing = false;
        Notify.create({
          message: `Тикет ${title} успешно создан`
        })
        // this.$router.push('/tickets/view/')
      })
        .catch(() => {
          // this.processing = false;
          Notify.create({
            message: `Не удалось создать тикет`
          })
          console.log('Не удалось создать тикет')
        })
    }
  }
}
</script>

<style scoped>

</style>
