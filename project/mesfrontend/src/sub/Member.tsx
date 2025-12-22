import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";


//다음 api관련
declare global{
  interface Window {
    daum: any;
  }
}

//성별 enum은 특별한 변수 대문자가 권장됨
type Gender = 'male' | 'female' | 'other' | "";

//신상명세 필드명에 맞는 타입을 명시
interface MemberForm{
  firstName : string;
  lastName : string;
  email:string;
  password:string;
  repeatPassword:string;
  gender:Gender;
  companyName:string;
  position:string;
  tel:string;
  address:string;
  detailAddress:string;
}

const Member = () => {
  //초기화
  const [form, setForm] = useState<MemberForm>({
  firstName : "",
  lastName : "",
  email:"",
  password:"",
  repeatPassword:"",
  gender:"",
  companyName:"",
  position:"",
  tel:"",
  address:"",
  detailAddress:"",
  });


  //여기서 부터 추가됨
//백앤드 기본주소 
const BACKEND_BASE_URL = "http://localhost:9500";
 //여기에 추가된게 끝남

 //카카오 회원가입(소셜 로그인)버튼 클릭시
 const handleKakaoSignup = () => {
  window.location.href=`${BACKEND_BASE_URL}/oauth2/authorization/kakao`;
 };

  //인스타 회원가입(소셜 로그인)버튼 클릭시
 const handleInstaSignup = () => {
  window.location.href=`${BACKEND_BASE_URL}/oauth2/authorization/instagram`;
 };


  //공통 입력값 변경 함수
  const handleChange = ( e:ChangeEvent<HTMLInputElement & HTMLSelectElement>) =>{
    //입력창에서 값이 바뀔때 리액트가 보내주는 이벤트 객체
    //회원가입 폼에서 input, select둘다 이 함수 하나로 처리하려는 의도
    const {name, value} = e.target;//실제로 값이 바뀐 DOM요소 그안에 여러속성이 있는데 구중에서 두개만 뽑아 쓰려 구조분해
    setForm((prev) => ({...prev,[name]:value}));
    //useState로 만든 form상태를 바꾸는 함수
    //...prev : 기존 값들을 그대로 복사하고
    //[name]:value : 방금 바뀐 그 한필드만 덮어씀

  };

  //성별 선택용 함수
  const handleGenderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({...prev, gender:e.target.value as Gender}));
    //...prev: 기존 값들은 그대로 복사하고 
    //이 값이 분명히 젠더 타입이야 라고 강제로 캐스팅할때 as
  };

  //폼전송(회원가입 요청)
   const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    if(form.password !== form.repeatPassword){
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다");
      return;
    }try{
      //백앤드 스프링부트 서버 url
      const response = await axios.post(
        "http://localhost:9500/members/register", form
      );
      console.log(response.data);
      alert("회원가입성공");
    }catch(error:any){
      console.error(error);
      alert("회원가입중 오류가 발생했습니다");
    }
   };

   const handleAddressSearch = () => {

    if(!window.daum || !window.daum.postcode){
/*
window = 브라우저 창을 나타내는 전역 객체
스크립트를 안불렀거나 || 준비가 되지 않앗거나
*/
      alert("주소 검색 스크립트 로딩 중 입니다. 잠시후 다시 시도해 주세요");
      return;
    }
//자바스크립트 콜백은 나중에 어떤일이 끝날때 실행해줘
    new window.daum.Postcode({
      //카카오에서 제공하는 우편번호 검색 팝업 객체를 하나 생성하는 코드
      //가장 중요한 opt션이  oncomplete 콜백
      oncomplete: (data: any) => {
        //oncomplete는 언제 실행됨? 검색 -> 주소선택 -> 확인 그리고 
        // 그때 data라는 객체를 함께 넘겨줍니다
        const fulladdr = data.address; //기본주소
        setForm((prev) => ({...prev, address: fulladdr}));
      },
    }).open();//옵션을 가진 우편번호 검색 팝업을 생성하고 바로 화면에 뛰어라
/*
why 이렇게 복잡하게 써 => 언제 끝날지 모르는 작업이 많아요
서버에 요청보내기 (axios, fetch)
버튼 클릭 / 입력값 변경
타이머
외부 스크립트 (다음 )결과 검색 기다리기

setTimeout(() => {
나는 3초 뒤에 실행 되므니다
},3000);
*/

   }
  
return (
    <Container className="mt-5">
      <script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        async
      ></script>

      <Card className="o-hidden border-0 shadow-lg mt-150">
        <Card.Body className="p-0">
          <Row>
            <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
            <div className="col-lg-7">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                </div>
                <Form className="user" onSubmit={handleSubmit}>
                  <div className="form-group row mb-2">
                    <Col sm={6} className="mb-3 mb-sm-0">
                      <Form.Control
                        type="text"
                        className="form-control-user"
                        placeholder="이름"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col sm={6}>
                      <Form.Control
                        type="text"
                        className="form-control-user"
                        placeholder="성"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                      />
                    </Col>
                  </div>

                  <div className="form-group mb-2">
                    <Form.Control
                      type="email"
                      className="form-control-user"
                      placeholder="이메일"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group row mb-2">
                    <Col sm={6} className="mb-3 mb-sm-0">
                      <Form.Control
                        type="password"
                        className="form-control-user"
                        placeholder="비밀번호"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="password"
                        className="form-control-user"
                        placeholder="비밀번호 확인"
                        name="repeatPassword"
                        value={form.repeatPassword}
                        onChange={handleChange}
                      />
                    </Col>
                  </div>

                  {/* 성별 추가 */}
                  <div className="form-group mb-2">
                    <label className="mr-3 form-label mx-2">성별 : </label>
                    <Form.Check
                      inline
                      type="radio"
                      label="남성"
                      name="gender"
                      value="male"
                      checked={form.gender === "male"}
                      onChange={handleGenderChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="여성"
                      name="gender"
                      value="female"
                      checked={form.gender === "female"}
                      onChange={handleGenderChange}  
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="기타"
                      name="gender"
                      value="other"
                      checked={form.gender === "other"}
                      onChange={handleGenderChange}  
                    />
                  </div>

                  <div className="form-group">
                    <div className="d-flex justify-between">
                      <Form.Control
                        type="text"
                        className="form-control-user"
                        placeholder="회사명"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                      />
                      <Form.Control
                        type="text"
                        className="form-control-user mx-4"
                        placeholder="직급"
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                      />
                      <Form.Control
                        type="text"
                        className="form-control-user"
                        placeholder="전화번호"
                        name="tel"
                        value={form.tel}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="d-flex btn-group br50">
                      <Form.Control
                        type="text"
                        className="form-control w-75"
                        name="address"
                        readOnly
                        value={form.address}
                      />
                      <button
                      type="button"
                      className="btn btn-secondary w-25"
                      onClick={handleAddressSearch}
                      >
                        주소검색
                      </button>
                    </div>
                    <div className="">
                      <Form.Control
                        type="text"
                        className="form-control-user w-100 mt-3"
                        placeholder="상세주소"
                        name="detailAddress"
                        value={form.detailAddress}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="btn-user btn-block mb-2"
                  >
                    회원가입
                  </Button>
                </Form>
                <hr />

<a href= "/" 
className="btn btn-google btn-user btn-block mb-2"
onClick={handleInstaSignup}
>
<i className=""></i>Register with Insta
</a>

<a href= "/" 
className="btn btn-facebook btn-user btn-block mb-2"
onClick={handleKakaoSignup}
>
<i className=""></i>Register with Kakao
</a>

                <div className="text-center mb-2">
                  <a href="/forgot" className="small">
                    Forgot password?
                  </a>
                </div>
                <div className="text-center">
                  <a href="/login" className="small">
                    Already have an account? Login!
                  </a>
                </div>
              </div>
            </div>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Member;