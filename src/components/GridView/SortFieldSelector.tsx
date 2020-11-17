import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { ThemeStyle } from '../../AppConfig';
import { 
    GridListSortField ,
    gridListSortFieldSelector,
    gridListSortFieldUpdated,
    isMobileSeletor
} from '../../store/reducers/UI';

import useOnClickOutside from '../../hooks/useOnClickOutside';

import {
    HeaderItemHeight,
    HeaderItemBackgroundColor,
    HeaderItemBorder
} from './constants';

const SortFields: {
    label: string;
    tooltip: string;
    value: GridListSortField
}[] = [
    {
        label: '100-Day Case Fatality Rate',
        value: 'CaseFatalityRate100Day',
        tooltip: 'The simple ratio of deaths to cases over the past 100 days. Counties with no deaths are omitted from this list.'
    },
    {
        label: 'Overall Case Fatality Rate',
        value: 'CaseFatalityRate',
        tooltip: 'The simple ratio of deaths to cases since March, 2020. Counties with no deaths are omitted from this list.'
    },
    {
        label: 'Total Cases per Capita',
        value: 'ConfirmedPerCapita',
        tooltip: 'Ratio of cumulative case counts to population.'
    },
    {
        label: 'Total Deaths per Capita',
        value: 'DeathsPerCapita',
        tooltip: 'Ratio of deaths to population.'
    },
    {
        label: 'Total Cases',
        value: 'Confirmed',
        tooltip: 'Total number of cases since March, 2020.'
    },
    {
        label: 'Total Deaths',
        value: 'Deaths',
        tooltip: 'Total number of Deaths since March, 2020.'
    }
]

const SortFieldSelector: React.FC = ()=>{

    const dispatch = useDispatch();

    const activeSortField = useSelector(gridListSortFieldSelector);

    const isMobile = useSelector(isMobileSeletor);

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
            value,
            tooltip
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
                        backgroundColor: HeaderItemBackgroundColor,
                        borderBottom: HeaderItemBorder,
                        borderLeft: `4px solid ${borderLeftColor}`,
                        cursor: 'pointer'
                    }}
                    onClick={()=>{
                        dispatch(gridListSortFieldUpdated(value))
                    }}
                    title={tooltip}
                >
                    <span className='font-size--2 avenir-demi'>{label}</span>
                </div>
            )
        });

        return (
            <div
                style={{
                    position: 'absolute',
                    top: HeaderItemHeight - 1,
                    left: 0,
                    width: '100%',
                    backgroundColor: HeaderItemBackgroundColor,
                    border: HeaderItemBorder,
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
                width: isMobile ? '100%' : '350px',
                height: HeaderItemHeight,
                backgroundColor: HeaderItemBackgroundColor,
                border: HeaderItemBorder,
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
                    paddingLeft: '1rem',
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
                    <span className='avenir-bold'>{getLabelForActiveSortField()}</span>
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
