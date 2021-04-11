import { Component } from '../core/component'
import { apiService} from '../services/api.service'
import {TransformService} from '../services/transform.service'
import {renderPost} from '../templates/post.template'

export class PostsComponent extends Component {
  constructor(id, {loader}) {
    super(id)
    this.loader = loader
  }

  init() {
    this.$el.addEventListener('click', buttonHandler.bind(this))
  }

  async onShow() {
    this.loader.show()
    const fbData = await apiService.fetchPosts()
    this.loader.hide()
    if (fbData) {
      const posts = TransformService.fbObjectToArray(fbData)
      const html = posts.map(post => renderPost(post, {withButton: true}))
      this.$el.insertAdjacentHTML('afterbegin', html.join(' '))
    }else {
      return this.$el.insertAdjacentHTML('afterbegin',`<p class="center">Вы пока ничего не добавили</p>` ) 
    }
  }

  onHide() {
    this.$el.innerHTML = ''
  }
}

function buttonHandler(event) {
  const target = event.target
  const id = target.dataset.id
  const title = target.dataset.title

  if(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []
    const candidate = favorites.find(p => p.id === id)

    if(candidate) {
      target.textContent = 'Сохранить'
      target.classList.add('button-primary')
      target.classList.remove('button-danger')
      favorites = favorites.filter(p => p.id !== id)
    } else {
      target.textContent = 'Удалить'
      target.classList.remove('button-primary')
      target.classList.add('button-danger')
      favorites.push({id, title})
    }

    localStorage.setItem('favorites', JSON.stringify(favorites))
  }
}
