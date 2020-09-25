import React, { useState } from 'react'
import { ThemeStyle } from '../../AppConfig';
import { 
    GridListSortField ,
    gridListSortFieldSelector,
    gridListSortFieldUpdated
} from '../../store/reducers/UI';

const SortFieldSelectorHeight = 60;
const BackgroundColor = '#EFEADC'

const SortFields: {
    label: string;
    value: GridListSortField
}[] = [
    {
        label: 'Case Fatality Rate',
        value: 'CaseFatalityRate' //"Confirmed" | "Deaths" | "ConfirmedPerCapita" | "DeathsPerCapita" | "CaseFatalityRate"
    },
    {
        label: 'Total Cases per Capita',
        value: 'ConfirmedPerCapita'
    },
    {
        label: 'Total Deaths per Capita',
        value: 'DeathsPerCapita'
    },
    {
        label: 'Total Cases',
        value: 'Confirmed'
    },
    {
        label: 'Total Deaths',
        value: 'Deaths'
    }
]

const SortFieldSelector: React.FC = ()=>{

    const [ isDropdownMenuOpen, setIsDropdownMenuOpen ] = useState<boolean>(false);
    // const [ activeLabel, setActiveLabel ] = useState<string>('')

    const getDropdownMenu = ()=>{
        if(!isDropdownMenuOpen){
            return null;
        }

        return (
            <div
                style={{
                    position: 'absolute',
                    top: SortFieldSelectorHeight,
                    left: 0,
                    width: '100%',
                    backgroundColor: BackgroundColor,
                }}
            > foobar </div>
        )
    }

    return (
        <div 
            style={{
                position: 'relative',
                width: '500px',
                height: SortFieldSelectorHeight,
                backgroundColor: BackgroundColor,
                border: `1px solid ${ThemeStyle["theme-color-khaki-dark-semi-transparent"]}`,
                color: ThemeStyle["theme-color-red"]
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '.75rem',
                    cursor: 'pointer'
                }}
                onClick={setIsDropdownMenuOpen.bind(this, !isDropdownMenuOpen)}
            >
                <div
                    style={{
                        flexGrow: 1,
                        flexBasis: '100px',
                        textTransform: 'uppercase'
                    }}
                >
                    <span className='margin-left-1 avenir-bold'>case fatality rate</span>
                </div>

                <div>
                    <span 
                        className={`${ isDropdownMenuOpen ? 'icon-ui-up-arrow' : 'icon-ui-down-arrow'} right`} 
                    ></span>
                </div>
                
            </div>

            { getDropdownMenu() }
        </div>
    )
}

export default SortFieldSelector
