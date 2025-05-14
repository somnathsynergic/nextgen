import './App.css';
import { Outlet } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { ConfigProvider } from 'antd';
function App() {
  console.log('app')
  return (

    <PrimeReactProvider>
    <ConfigProvider theme={{
    components: {
      Steps:{
        colorPrimary:'#22543d',
      },
      Empty:{
        colorTextDescription:'#014737'
      },
      Timeline:{
        dotBg:'#22543d',
        tailColor:'#22543d',
        colorPrimary:'#22543d',
        },
      Select: {
        colorPrimary: '#22543d',
        colorPrimaryHover: '#22543d',
        optionActiveBg: '#22543d',
        optionSelectedColor:'#000000',
        optionSelectedFontWeight: '700',

      },
      DatePicker:{
        activeBorderColor:'#22543d',
        hoverBorderColor:'#22543d',
        colorPrimary:'#22543d'
      },
      Breadcrumb:{separatorColor:'#052d27', itemColor:'#052d27', lastItemColor:'#052d27',fontSize:15},
      Menu: {
        itemBg:'#014737',
        subMenuItemBg:'#014737',
        subMenuItemBorderRadius:50,
        popupBg:'#014737',
        itemColor:'#D1D5DB',
        itemSelectedBg:'white',
        itemBorderRadius:50,
        itemMarginInline:15,
        itemHoverBg:'white',
        itemSelectedColor:'#4C9F70',
        // itemSelectedColor:'#014737',
        itemHoverColor:'#014737',
        itemDisabledColor:'#FEF08A'
      },
      Segmented:{
        itemActiveBg:'#014737',
        itemColor:'#014737',
        itemSelectedColor:'white',
        itemSelectedBg:'#014737',
        
      },
      FloatButton:{
        borderRadiusLG:20,
        borderRadiusSM:20,
        colorPrimary:'#eb8d00',
        colorPrimaryHover:'#eb8d00',
        margin:30
      },
      Button:{
        hoverBorderColor:'#014737',
        itemHoverColor:'#014737'
      },
      Switch:{
         colorPrimary:'#014737',
        colorPrimaryHover:'#014737'
      },
      Checkbox:{
        colorPrimary:'#014737',
        colorText:'#014737',
        colorPrimaryHover:'#014737',
        colorTextDisabled:'#014733',
        colorBorder:'#22543d'
      },
      Descriptions:{
        titleColor:'#014737',
        colorTextLabel:'#014737',
        colorText:'#014737',
        colorSplit:'#014737',
        labelBg:'#F1F5F9'
        
      },
      Popover:{
        colorBgElevated:'#014737',
        colorText:'white',
        colorTextHeading:'white',
        motionDurationMid:0.9,
        zIndexPopup:99
      },
      Popconfirm:{
        colorBgElevated:'white',
        colorText:'white',
        colorTextHeading:'white'
      },
      Tabs:{
        inkBarColor:'#014737',
        itemColor:'#014737',
        itemSelectedColor:'#014737',
        itemHoverColor:'#014737',
        itemActiveColor:'#014737'
      },
      Dropdown:{
        colorBgElevated:'white',
        colorText:'#014737',
        controlItemBgHover:'#D1D5DB'

      },
      Radio:{
        colorPrimary:"#014737",
        buttonColor:'#014737',
        colorBorder:'#014737'
      }
    },
  }}>
    <Outlet/>
    </ConfigProvider>   
    </PrimeReactProvider>    
  );
}

export default App;
