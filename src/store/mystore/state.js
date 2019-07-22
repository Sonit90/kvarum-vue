import { LocalStorage } from 'quasar'
export default {
  title: 'Тикеты',
  tickets: [],
  ticket: [],
  perPage: 30,
  editing: false,
  token: LocalStorage.getItem('token'),
  status: '',
  filters: ['Открыт', 'В работе', 'Назначен сервисный инженер', 'Ожидает подтверждения со стороны клиента', 'Ожидает подтверждения со стороны администратора']
}
