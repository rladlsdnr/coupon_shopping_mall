import { Title } from 'src/components/elements/styled-components';
import styled from 'styled-components'


const Wrappers = styled.div`
max-width:500px;
display:flex;
flex-direction:column;
margin: 0 auto;
width: 90%;
min-height:90vh;
`


const Demo1 = (props) => {
  const {
    data: {

    },
    func: {
      router
    },
  } = props;

  return (
    <>
      <Wrappers>
        <Title>회원가입</Title>
      </Wrappers>
    </>
  )
}
export default Demo1
