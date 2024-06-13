import React, { useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Link,
  Spinner,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

export function MemberLogin(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    // 유효성 검사
    if (!email) {
      setError("이메일이 입력되지 않았습니다.");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError("비밀번호가 입력되지 않았습니다.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/member/token", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        // 로그인 성공 시 처리
        const { token, id } = response.data;
        // 토큰을 로컬 스토리지에 저장
        if (rememberMe) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }
        // 로그인 후 리다이렉션
        window.location.href = `/member/edit/${id}`;
      } else {
        setError("로그인에 실패했습니다.");
      }
    } catch (error) {
      setError("이메일 또는 비밀번호를 다시 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Center>
        <Box w={500} p={6} boxShadow="lg" borderRadius="md" bg="white">
          <Box mb={10} fontSize="2xl" fontWeight="bold" textAlign="center">
            로그인
          </Box>
          <Box>
            {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}
            <FormControl mb={4}>
              <FormLabel>이메일</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>비밀번호</FormLabel>
              <InputGroup>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                ></Input>
              </InputGroup>
            </FormControl>
            <Flex justifyContent="space-between" mb={5}>
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  isChecked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  colorScheme="purple"
                  css={{
                    "& .chakra-checkbox__label": {
                      cursor: "default",
                    },
                  }}
                >
                  <Box fontSize="sm">로그인 유지</Box>
                </Checkbox>
              </FormControl>
              <Flex
                gap={5}
                fontSize="sm"
                justifyContent="flex-end"
                alignItems="center"
                minWidth="200px"
              >
                <Link
                  as={RouterLink}
                  to="/member/find"
                  whiteSpace="nowrap"
                  _hover={{ fontWeight: "bold" }}
                >
                  비밀번호 찾기
                </Link>
                <Link
                  as={RouterLink}
                  to="/member/signup"
                  whiteSpace="nowrap"
                  _hover={{ fontWeight: "bold" }}
                >
                  회원가입
                </Link>
              </Flex>
            </Flex>
            <Box mt={5}>
              <Button
                width={"100%"}
                _hover={{ bgColor: "purple.500 ", color: "white" }}
                onClick={handleLogin}
                isLoading={isLoading}
              >
                {isLoading ? <Spinner size="sm" /> : "로그인"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Center>
    </>
  );
}
