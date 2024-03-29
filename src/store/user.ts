
import { defineStore } from 'pinia'


export const useUserStore = defineStore('user', {
  state: () => {
    return {
      login: false,
      data: {
        "_id": "66055cb09a360c7b78247214",
        "username": "test123",
        "active": "true",
        "note": "",
        "workplace": "",
        "resign_at": null,
        "contact": [],
        "worklist": [],
        "created_at": "2024-03-28T12:04:00.391Z",
        "clock_in": [
            {
                "start": "2024-01-01T12:30:59.000Z",
                "modified_at": "2024-03-28T12:08:11.876Z",
                "_id": "66055dab95a0e3001f5b03f2"
            }
        ],
        "__v": 0
    }
    }
  },
  getters: {
    isIOSPhone: () =>
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Chrome|Opera Mini/i.test(
        navigator.userAgent
      ),
    timezone: () => {
      return Math.abs(new Date().getTimezoneOffset() / 60)
    }
  },
  actions: {
    // async loginHandler(data: LoginFormData): Promise<void> {
    //   const encryptor = new JSEncrypt()
    //   encryptor.setPublicKey(rsaPublicKey)
    //   const password = encodeURIComponent(encryptor.encrypt(data.password) as string)

    //   const { data: userData } = await userLogin({
    //     ...data,
    //     password
    //   })

    //   localStorage.setItem('token', userData.data.access_token)
    //   localStorage.setItem('username', userData.data.username)
    //   await this.getUserData()
    //   await this.getDefaultSetting()
    //   const page = usePage()
    //   page.showToast({ type: 'success', content: i18n.global.t('login.success') })
    //   this.login = true
    // },
 
    // async getUserData(): Promise<void> {
    //   try {
    //     const res = await getUserData()

    //     if (res.data.code === HttpResponse.SUCCESS_CODE) {
    //       this.login = true
    //       this.data = res.data.data
    //       return
    //     }
    //     throw new Error(res.data.msg)
    //   } catch (err) {
    //     console.error(err)
    //   }
    // },
   
  }
})
