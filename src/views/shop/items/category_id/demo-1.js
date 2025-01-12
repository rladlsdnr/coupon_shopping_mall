import { useEffect, useState } from 'react';
import { test_items } from 'src/data/test-data';
import styled from 'styled-components'
import { useTheme } from "@emotion/react";
import { useRouter } from "next/router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { commarNumber, getAllIdsWithParents } from 'src/utils/function';
import { Col, Row, RowMobileColumn, Title, themeObj } from 'src/components/elements/styled-components';
import { useSettingsContext } from 'src/components/settings';
import { Item, Items } from 'src/components/elements/shop/common';
import _ from 'lodash';
import { Breadcrumbs, Button, Divider } from '@mui/material';
import { Icon } from '@iconify/react';
const ContentWrapper = styled.div`
max-width:1200px;
width:90%;
margin: 0 auto 5rem auto;
display:flex;
flex-direction:column;
`
const CategoryContainer = styled.div`

`
const Demo1 = (props) => {
  const {
    data: {

    },
    func: {
      router
    },
  } = props;
  const { themeCategoryList, themeMode } = useSettingsContext();

  const [curCategories, setCurCategories] = useState([]);
  useEffect(() => {
    if (themeCategoryList.length > 0) {
      let parent_list = getAllIdsWithParents(themeCategoryList);
      let use_list = [];
      for (var i = 0; i < parent_list.length; i++) {
        if (parent_list[i][router.query?.depth]?.id == router.query?.category_id) {
          use_list = parent_list[i];
          break;
        }
      }
      setCurCategories(use_list);
    }
  }, [themeCategoryList, router.query])

  return (
    <>
      <ContentWrapper>
        {curCategories.length > 1 ?
          <>
            <Breadcrumbs separator={<Icon icon='material-symbols:navigate-next' />} style={{
              padding: '0.5rem 0',
              width:'100%',
              overflowX:'auto'
            }}>
              {curCategories.map((item, idx) => (
                <>
                  <div style={{
                    color: `${idx == curCategories.length - 1 ? (themeMode == 'dark' ? '#fff' : '#000') : ''}`,
                    fontWeight: `${idx == curCategories.length - 1 ? 'bold' : ''}`,
                    cursor: 'pointer'
                  }}
                    onClick={() => {
                      router.push(`/shop/items/${item?.id}?depth=${idx}`)
                    }}
                  >{item.category_name}</div>
                </>
              ))}
            </Breadcrumbs>
          </>
          :
          <>
            <div style={{ marginTop: '42px' }} />
          </>}
        <Title style={{ marginTop: '38px' }}>
          {curCategories[curCategories.length - 1]?.category_name}
        </Title>
        <Row style={{ margin: '0 auto', overflowX: 'auto', width: '100%', whiteSpace: 'nowrap' }} className='none-scroll'>
          {curCategories[curCategories.length - 1]?.children && curCategories[curCategories.length - 1]?.children.map((item, idx) => (
            <>
              <Button variant="outlined" style={{
                height: '36px',
                marginRight: `${idx == curCategories[curCategories.length - 1]?.children.length - 1 ? 'auto' : '0.25rem'}`,
                marginLeft: `${idx == 0 ? 'auto' : '0'}`
              }}
                onClick={() => {
                  router.push(`/shop/items/${item?.id}?depth=${parseInt(router.query?.depth) + 1}`)
                }}
              >{item.category_name}</Button>
            </>
          ))}
        </Row>
        <div style={{
          marginTop: '1rem'
        }} />
        <Divider />
        <div style={{
          marginTop: '1rem'
        }} />
        {test_items.length > 0 ?
          <>
            <Items items={test_items} router={router} />
          </>
          :
          <>
            <Col>
              <Icon icon={'basil:cancel-outline'} style={{ margin: '8rem auto 1rem auto', fontSize: themeObj.font_size.size1, color: themeObj.grey[300] }} />
              <div style={{ margin: 'auto auto 8rem auto' }}>검색결과가 없습니다.</div>
            </Col>
          </>}
      </ContentWrapper>
    </>
  )
}
export default Demo1
