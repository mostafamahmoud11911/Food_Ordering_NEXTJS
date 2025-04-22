import { Locale } from '@/i18n.config'
import 'server-only'
 
const dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  ar: () => import('../dictionaries/ar.json').then((module) => module.default),
}
 
export const getTrans = async (locale: Locale) => {

  switch(locale) {
    case 'en':
      return dictionaries.en()
    case 'ar':
      return dictionaries.ar()
  }

}