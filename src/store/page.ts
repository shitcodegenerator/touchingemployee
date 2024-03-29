import { defineStore } from 'pinia'
import { NotifyType, ToastType } from 'vant'

interface Toast {
  type: ToastType
  status: boolean
  content: string
  duration: number
}

export default defineStore('page', {
  state: () => {
    return {

      loading: false,

      toast: {
        type: 'success',
        status: false,
        content: '',
        duration: 2000
      },
      slideUp: {
        type: 'success',
        status: false,
        content: ''
      },
      actionSheet: {
        status: false,
        title: 'Title',
        duration: 2000,
        type: 'success',
        content: '',
        btnText: '',
        onClose: () => {
          console.log('onClose')
        },
        onBtnClick: () => {
          console.log('onBtnClick')
        }
      }
    }
  },

  actions: {
    showToast({ type = 'success', content = '', duration = 2000, status = true }) {
      this.toast = { type, content, duration, status }
      setTimeout(() => {
        this.toast.status = false
      }, duration)
    },
    showSheet({
      status = true,
      title = '',
      type = 'success',
      content = '',
      btnText = 'common.confirm',
      duration = 2000,
      onClose = () => {
        this.actionSheet.status = false
      },
      onBtnClick = () => {
        this.actionSheet.status = false
      }
    }) {
      this.actionSheet = {
        status,
        title,
        type,
        content,
        btnText: 'common.cancel',
        onClose,
        onBtnClick: () => {
          onBtnClick()
          this.actionSheet.status = false
        },
        duration
      }

      if (!duration) return
      setTimeout(() => {
        this.actionSheet.status = false
      }, 2000)
    }
  }
})
