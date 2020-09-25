import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { ThemeStyle } from '../../AppConfig';
import { 
    GridListSortField ,
    gridListSortFieldSelector,
    gridListSortFieldUpdated
} from '../../store/reducers/UI';

import useOnClickOutside from '../../hooks/useOnClickOutside';

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

    const dispatch = useDispatch();

    const activeSortField = useSelector(gridListSortFieldSelector);

    const [ isDropdownMenuOpen, setIsDropdownMenuOpen ] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>();

    const getLabelForActiveSortField = ()=>{
        const activeItem = SortFields.filter(d=>d.value === activeSortField)[0];
        
        if(!activeItem){
            return ''
        }

        return activeItem.label;
    }

    useOnClickOutside(containerRef, ()=>{
        setIsDropdownMenuOpen(false);
    });
    
    const getDropdownMenu = ()=>{
        if(!isDropdownMenuOpen){
            return null;
        }

        const menuOptions = SortFields.map(({
            label,
            value
        })=>{

            const borderLeftColor = value === activeSortField 
                ? ThemeStyle["theme-color-red"] 
                : 'transparent';

            return (
                <div
                    key={value}
                    style={{
                        width: '100%',
                        padding: '.5rem 1.5rem',
                        backgroundColor: BackgroundColor,
                        borderBottom: `1px solid ${ThemeStyle["theme-color-khaki-dark-semi-transparent"]}`,
                        borderLeft: `4px solid ${borderLeftColor}`,
                        cursor: 'pointer'
                    }}
                    onClick={()=>{
                        dispatch(gridListSortFieldUpdated(value))
                    }}
                >
                    <span className='font-size--2 avenir-demi'>{label}</span>
                </div>
            )
        });

        return (
            <div
                style={{
                    position: 'absolute',
                    top: SortFieldSelectorHeight - 1,
                    left: 0,
                    width: '100%',
                    backgroundColor: BackgroundColor,
                    border: `1px solid ${ThemeStyle["theme-color-khaki-dark-semi-transparent"]}`,
                    borderBottom: 'none',
                    zIndex: 1
                }}
            > {menuOptions} </div>
        )
    }

    return (
        <div 
            ref={containerRef}
            style={{
                position: 'relative',
                width: '350px',
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
                    <span className='margin-left-1 avenir-bold'>{getLabelForActiveSortField()}</span>
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
