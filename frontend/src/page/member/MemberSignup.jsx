import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function MemberSignup(props) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isBirthDateValid, setIsBirthDateValid] = useState(false);

  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [nationality, setNationality] = useState("korean");
  const [birth_date, setBirth_date] = useState("");
  const [phone_number, setPhone_number] = useState("");

  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  const navigate = useNavigate();
  const toast = useToast();
  /* 유효성 */

  // 이메일 유효성 검사
  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/.test(email);
    if (emailRegex) {
      setIsEmailValid(true);
    }
    console.log(emailRegex);
  }

  // 비밀번호 유효성 검사
  function validatePassword(password) {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        password,
      );
    if (passwordRegex) {
      setIsPasswordValid(true);
    }
    console.log(passwordRegex);
  }

  // 생년월일 유효성 검사
  function validateBirthDate(date) {
    if (date.length !== 8) return false; // 길이가 8이 아니면 false 반환

    const year = parseInt(date.substring(0, 4), 10);
    const month = parseInt(date.substring(4, 6), 10);
    const day = parseInt(date.substring(6, 8), 10);
    const currentYear = new Date().getFullYear();

    if (year < 1900 || year > currentYear) return false; // 연도가 1900-현재 연도 범위가 아니면 false 반환
    if (month < 1 || month > 12) return false; // 월이 1-12 범위가 아니면 false 반환

    // 월별 일자
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && day === 29) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return true; // 윤년이면 true 반환
      }
      return false; // 윤년이 아니면 false 반환
    }
    if (day < 1 || day > daysInMonth[month - 1]) return false;
    return true; // 위 조건에 모두 부합하면 true 반환
  }

  // 생년월일 정규식
  function handleBirthDateChange(e) {
    const birthDateRegex = e.target.value.replace(/[^0-9]/g, "").slice(0, 8); // 숫자만 입력받고 8자리로 제한
    setBirth_date(birthDateRegex);

    const isValid = validateBirthDate(birthDateRegex); // 생년월일 유효성 검사 호출
    setIsBirthDateValid(isValid); // 유효성 검사 결과 업데이트
    console.log(`Birth date is ${isValid ? "valid" : "invalid"}`);
  }

  // 휴대폰 번호 정규식
  function handlePhoneNumberChange(e) {
    const phoneNumberRegex = e.target.value
      .replace(/[^0-9]/g, "") // 숫자만 입력받기
      .replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]{3,4})([0-9]{4})/g, "$1-$2-$3");
    setPhone_number(phoneNumberRegex);
  }

  // 계정 중복확인
  function handleCheckEmail() {
    axios
      .get(`/api/member/check?email=${email}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 이메일입니다.",
          position: "top",
        });
      }) // 이미 있는 이메일 (사용 못함)
      .catch((err) => {
        if (err.response.status === 404) {
          // 사용할 수 있는 이메일
          toast({
            status: "info",
            description: "사용할 수 있는 이메일입니다.",
            position: "top",
          });
        }
      })
      .finally();
  }

  function handleCheckNickname() {
    axios
      .get(`/api/member/check?nickname=${nickname}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 닉네임입니다.",
          position: "top",
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "사용할 수 있는 닉네임입니다.",
            position: "top",
          });
        }
      })
      .finally();
  }

  // 비밀번호 보기/숨기기
  function handleClickPassword() {
    setShowPassword(!showPassword);
  }

  const isPasswordRight = password === confirmPassword;

  // 주소 검색
  function openPostcodePopup() {
    const postcodePopup = new window.daum.Postcode({
      onComplete: function (data) {
        setAddress(data.address);
        setPostcode(data.zonecode);
      },
    });
    postcodePopup.open();
  }

  const handleSubmit = () => {
    // 폼 검증 로직 등을 추가하고 유효성 검사 후 경로 이동
    if (isEmailValid && password === confirmPassword) {
      navigate("/signup/stepb");
    } else {
      // 오류 처리
      alert("입력정보를 확인해주세요.");
    }
  };

  function testFunction() {
    console.log(name);
    console.log(gender);
    console.log(nationality);
    console.log(birth_date);
    console.log(phone_number);
    console.log(postcode);
    console.log(address + " " + addressDetail);
  }

  // 성별 선택 핸들러
  function handleGenderSelect(selectedGender) {
    setGender(selectedGender);
  }

  // 국적 선택 핸들러
  function handleNationalitySelect(selectedNationality) {
    setNationality(selectedNationality);
  }

  return (
    <>
      <Center>
        <Box w={500}>
          <Box mb={3} border={"1px solid red"}>
            <FormControl isRequired>
              <InputGroup>
                <Input
                  type="email"
                  placeholder={"이메일"}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                />{" "}
                <InputRightElement w={"75px"} mr={1}>
                  <Button onClick={handleCheckEmail} size={"sm"}>
                    중복확인
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <InputGroup>
                <Input
                  placeholder={"닉네임"}
                  onChange={(e) => {
                    setNickname(e.target.value);
                  }}
                />
                <InputRightElement w={"75px"} mr={1}>
                  <Button size={"sm"} onClick={handleCheckNickname}>
                    중복확인
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <InputGroup>
                <Input
                  placeholder="비밀번호"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClickPassword}>
                    {showPassword ? "숨기기" : "보기"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <InputGroup>
                <Input
                  placeholder="비밀번호 확인"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
              </InputGroup>
              {isPasswordRight || (
                <FormHelperText>비밀번호가 일치하지 않습니다.</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box border={"1px solid red"}>
            <FormControl isRequired>
              <Input
                placeholder="이름"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FormControl>
            <Flex>
              <FormControl isRequired>
                <Flex justifyContent={"space-around"} mt={4} mb={4}>
                  <Box
                    w="100px"
                    h="40px"
                    border="1px solid"
                    borderColor={gender === "male" ? "blue" : "gray"}
                    bg={gender === "male" ? "blue.100" : "white"}
                    onClick={() => handleGenderSelect("male")}
                    cursor="pointer"
                    textAlign="center"
                    lineHeight="40px"
                    borderRadius="5px"
                    mx={2}
                  >
                    남성
                  </Box>
                  <Box
                    w="100px"
                    h="40px"
                    border="1px solid"
                    borderColor={gender === "female" ? "pink" : "gray"}
                    bg={gender === "female" ? "pink.100" : "white"}
                    onClick={() => handleGenderSelect("female")}
                    cursor="pointer"
                    textAlign="center"
                    lineHeight="40px"
                    borderRadius="5px"
                    mx={2}
                  >
                    여성
                  </Box>
                </Flex>
              </FormControl>
              <Box border={"1px solid #f1f1f1"}></Box>
              <FormControl isRequired>
                <Flex justifyContent={"space-around"} mt={4} mb={4}>
                  <Box
                    w="100px"
                    h="40px"
                    border="1px solid"
                    borderColor={nationality === "korean" ? "green" : "gray"}
                    bg={nationality === "korean" ? "green.100" : "white"}
                    onClick={() => handleNationalitySelect("korean")}
                    cursor="pointer"
                    textAlign="center"
                    lineHeight="40px"
                    borderRadius="5px"
                    mx={2}
                  >
                    내국인
                  </Box>
                  <Box
                    w="100px"
                    h="40px"
                    border="1px solid"
                    borderColor={
                      nationality === "foreigner" ? "orange" : "gray"
                    }
                    bg={nationality === "foreigner" ? "orange.100" : "white"}
                    onClick={() => handleNationalitySelect("foreigner")}
                    cursor="pointer"
                    textAlign="center"
                    lineHeight="40px"
                    borderRadius="5px"
                    mx={2}
                  >
                    외국인
                  </Box>
                </Flex>
              </FormControl>
            </Flex>
            <FormControl>
              <Input
                placeholder="생년월일 8자리 ( YYYYMMDD )"
                value={birth_date}
                onChange={handleBirthDateChange}
              />
              {birth_date && (
                <Box color={isBirthDateValid ? "green" : "red"} mt={1}>
                  {isBirthDateValid
                    ? "유효한 생년월일입니다."
                    : "유효하지 않은 생년월일입니다."}
                </Box>
              )}
            </FormControl>
            <FormControl>
              <Input
                placeholder="휴대폰 번호 ( -는 제외하고 입력 )"
                type="tel"
                value={phone_number}
                maxlength={13}
                onChange={handlePhoneNumberChange} // 핸들러 연결
              />
            </FormControl>
            <FormControl>
              <Flex>
                <Input readOnly value={postcode} placeholder="우편번호" />
                <Button onClick={openPostcodePopup}>주소 검색</Button>
              </Flex>
              <Input
                readOnly
                value={address}
                placeholder="주소를 선택하세요."
              />
              <Input
                value={addressDetail}
                onChange={(e) => {
                  setAddressDetail(e.target.value);
                }}
                placeholder="상세주소 입력"
              />
            </FormControl>
          </Box>
          <Button
            onClick={() => {
              navigate("/signup/stepa");
            }}
          >
            이전
          </Button>
          <Button onClick={handleSubmit}>다음</Button>
          <Button onClick={testFunction}>test</Button>
        </Box>
      </Center>
    </>
  );
}
