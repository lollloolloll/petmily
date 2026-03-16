import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const KAKAO_SCRIPT_ID = "kakao-map-sdk";
const KAKAO_APP_KEY = "d5b3cb3d230c4f406001bbfad60ef4d4";

const loadKakaoSdk = () => {
  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(KAKAO_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.kakao), {
        once: true,
      });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Kakao Maps SDK")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_SCRIPT_ID;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (!window.kakao?.maps?.load) {
        reject(new Error("Kakao Maps SDK loaded without maps API"));
        return;
      }
      window.kakao.maps.load(() => resolve(window.kakao));
    };
    script.onerror = () => reject(new Error("Failed to load Kakao Maps SDK"));
    document.head.appendChild(script);
  });
};

const KakaoMap2 = ({ width = "600px", height = "400px" }) => {
  const kakaoMaps = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const renderFallbackMap = async () => {
      try {
        const kakao = await loadKakaoSdk();
        if (cancelled || !kakaoMaps.current) return;

        const container = kakaoMaps.current;
        const defaultCenter = new kakao.maps.LatLng(37.5665, 126.978);
        const map = new kakao.maps.Map(container, {
          center: defaultCenter,
          level: 5,
          draggable: false,
          scrollwheel: false,
        });

        new kakao.maps.Marker({
          map,
          position: defaultCenter,
        });

        if (!navigator.geolocation) {
          setError("위치 정보를 사용할 수 없어 기본 지도를 표시합니다.");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (cancelled) return;
            const currentPosition = new kakao.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude,
            );
            map.setCenter(currentPosition);
            new kakao.maps.Marker({
              map,
              position: currentPosition,
            });
            setError("");
          },
          () => {
            if (!cancelled) {
              setError("위치 권한이 없어 기본 지도를 표시합니다.");
            }
          },
          { timeout: 5000 },
        );
      } catch (e) {
        if (!cancelled) {
          console.error("KakaoMap2 load error:", e);
          setError("지도를 불러오지 못해 안내 화면으로 대체했습니다.");
        }
      }
    };

    renderFallbackMap();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Flex direction="column" justify="center" align="center" w="100%" h="100%">
      <Box
        id="map"
        ref={kakaoMaps}
        style={{ width, height, border: "1px solid #ccc", borderRadius: "12px" }}
        bg="gray.50"
      />
      {error && (
        <Text mt={2} fontSize="sm" color="gray.600">
          {error}
        </Text>
      )}
    </Flex>
  );
};

export default KakaoMap2;
