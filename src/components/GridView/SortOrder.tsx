import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { ThemeStyle } from '../../AppConfig';

import { 
    GridListSortOrder,
    gridListSortOrderSelector,
    gridListSortOrderUpdated
} from '../../store/reducers/UI';

import {
    HeaderItemHeight,
    HeaderItemBorder,
    HeaderItemBackgroundColor
} from './constants';

const SortOrderData: {
    label: string;
    value: GridListSortOrder
}[] = [
    {
        label: 'Largest to Smallest',
        value: 'descending'
    },
    {
        label: 'Smallest to Largest',
        value: 'ascending'
    }
]


const SortOrder = () => {

    const dispatch = useDispatch();

    const activeSortOrder = useSelector(gridListSortOrderSelector);

    const getBtns = ()=>{
        return SortOrderData.map(({
            label, 
            value
        }, index)=>{

            const isActive = activeSortOrder === value;

            return (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 .75rem',
                        backgroundColor: isActive ? ThemeStyle["theme-color-khaki-bright"] : ThemeStyle["theme-color-khaki"],
                        borderBottom: isActive 
                            ? `4px solid ${ThemeStyle['theme-color-red']}`
                            : `4px solid transparent`,
                        borderRight: index === 0 ? HeaderItemBorder : 'none',
                        cursor: 'pointer'
                    }}
                    onClick={()=>{
                        dispatch(gridListSortOrderUpdated(value))
                    }}
                >   
                    <span className='font-size--2 avenir-demi'>
                        { label }
                    </span>
                </div>
            )
        })
    }

    return (
        <div
            style={{
                height: HeaderItemHeight,
                backgroundColor: HeaderItemBackgroundColor,
                border: HeaderItemBorder,
                color: ThemeStyle["theme-color-red"],
                marginLeft: '1rem',
                display: 'flex'
            }}
        >
            { getBtns() }
        </div>
    )
}

export default SortOrder
