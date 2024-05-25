const emailSubject = require('~/consts/emailSubject')

const templateList = {
  [emailSubject.EMAIL_CONFIRMATION]: {
    en: {
      subject: 'Please confirm your email',
      template: `${__dirname}/en/confirm-email`
    },
    ua: {
      subject: 'Будь ласка, підтвердіть свою електронну адресу',
      template: `${__dirname}/ua/confirm-email`
    }
  },
  [emailSubject.RESET_PASSWORD]: {
    en: {
      subject: 'Reset your account password',
      template: `${__dirname}/en/reset-password`
    },
    ua: {
      subject: 'Скиньте пароль для свого акаунту',
      template: `${__dirname}/ua/reset-password`
    }
  },
  [emailSubject.SUCCESSFUL_PASSWORD_RESET]: {
    en: {
      subject: 'Your password was changed',
      template: `${__dirname}/en/sucessful-password-reset`
    },
    ua: {
      subject: 'Ваш пароль було змінено',
      template: `${__dirname}/ua/sucessful-password-reset`
    }
  },
  [emailSubject.LONG_TIME_WITHOUT_LOGIN]: {
    en: {
      subject: 'You have been inactive for too long',
      template: `${__dirname}/en/long-time-without-login`
    },
    ua: {
      subject: 'Ви занадто довго були неактивні',
      template: `${__dirname}/ua/long-time-without-login`
    }
  },
  [emailSubject.ADMIN_INVITATION]: {
    en: {
      subject: 'Admin invitation',
      template: `${__dirname}/en/invite-admin`
    },
    ua: {
      subject: 'Запрошення адміна',
      template: `${__dirname}/ua/invite-admin`
    }
  }
}

module.exports = { templateList }
