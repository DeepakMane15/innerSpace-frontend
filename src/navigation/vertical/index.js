// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },

    // {
    //   title: 'Account Settings',
    //   icon: AccountCogOutline,
    //   path: '/account-settings'
    // },
    {
      title: 'Purchase',
      icon: Table,
      path: '/purchase'
    },
    {
      title: 'Sale',
      icon: Table,
      path: '/sale'
    },
    {
      title: 'Invoice',
      icon: Table,
      path: '/invoice'
    },
    {
      title: 'Stock-Details',
      icon: Table,
      path: '/stock-details'
    },


    {
      sectionTitle: 'Masters'
    },
    {
      title: 'Product',
      icon: FormatLetterCase,
      path: '/master'
    },
    {
      title: 'Category',
      icon: Login,
      path: '/category'
    },
    {
      title: 'Sub-Category',
      icon: AccountPlusOutline,
      path: '/sub-category'
    },
    {
      title: 'Sizes',
      icon: AlertCircleOutline,
      path: '/sizes'
    },
    {
      title: 'Party',
      icon: AccountPlusOutline,
      path: '/party'
    },

    // {
    //   sectionTitle: 'User Interface'
    // },
    // {
    //   title: 'Typography',
    //   icon: FormatLetterCase,
    //   path: '/typography'
    // },
    // {
    //   title: 'Icons',
    //   path: '/icons',
    //   icon: GoogleCirclesExtended
    // },
    // {
    //   title: 'Cards',
    //   icon: CreditCardOutline,
    //   path: '/cards'
    // },
    // {
    //   icon: CubeOutline,
    //   title: 'Form Layouts',
    //   path: '/form-layouts'
    // }
  ]
}

export default navigation
