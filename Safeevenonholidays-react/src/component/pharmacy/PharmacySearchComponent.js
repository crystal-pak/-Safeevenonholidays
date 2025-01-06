import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Pagination, Row, Col, Button, Container, Card, Form } from 'react-bootstrap'
import FavoriteComponent from '../common/FavoriteComponent'
import { useNavigate, useNavigationType } from 'react-router-dom'
import { getReviewsByPharmacy } from '../../api/reviewApi'

const useIsBackNavigation = () => {
  const navigationType = useNavigationType();
  return navigationType === "POP";
}

const PharmacySearchComponent = () => {
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [pharmacies, setPharmacies] = useState([])
  const [sortedPharmacies, setSortedPharmacies] = useState([])
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // 한 페이지당 보여줄 데이터 개수
  const [totalItems, setTotalItems] = useState(0) // 전체 데이터 개수
  const isBackNavigation = useIsBackNavigation()
  const [reviews, setReviews] = useState([])

  // 시도 데이터
  const cities = [
    "서울특별시",
    "부산광역시",
    "대구광역시",
    "인천광역시",
    "광주광역시",
    "대전광역시",
    "울산광역시",
    "세종특별자치시",
    "경기도",
    "강원도",
    "충청북도",
    "충청남도",
    "전라북도",
    "전라남도",
    "경상북도",
    "경상남도",
    "제주특별자치도",
  ];

  // 시군구 데이터
  const districts = {
    서울특별시: [
      "종로구",
      "중구",
      "용산구",
      "성동구",
      "광진구",
      "동대문구",
      "중랑구",
      "성북구",
      "강북구",
      "도봉구",
      "노원구",
      "은평구",
      "서대문구",
      "마포구",
      "양천구",
      "강서구",
      "구로구",
      "금천구",
      "영등포구",
      "동작구",
      "관악구",
      "서초구",
      "강남구",
      "송파구",
      "강동구",
    ],
    부산광역시: [
      "중구",
      "서구",
      "동구",
      "영도구",
      "부산진구",
      "동래구",
      "남구",
      "북구",
      "해운대구",
      "사하구",
      "금정구",
      "강서구",
      "연제구",
      "수영구",
      "사상구",
      "기장군",
    ],
    대구광역시: ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군"],
    인천광역시: [
      "중구",
      "동구",
      "미추홀구",
      "연수구",
      "남동구",
      "부평구",
      "계양구",
      "서구",
      "강화군",
      "옹진군",
    ],
    광주광역시: ["동구", "서구", "남구", "북구", "광산구"],
    대전광역시: ["동구", "중구", "서구", "유성구", "대덕구"],
    울산광역시: ["중구", "남구", "동구", "북구", "울주군"],
    세종특별자치시: ["세종특별자치시"],
    경기도: [
      "수원시",
      "고양시",
      "용인시",
      "성남시",
      "부천시",
      "안산시",
      "남양주시",
      "안양시",
      "화성시",
      "평택시",
      "시흥시",
      "파주시",
      "김포시",
      "광명시",
      "군포시",
      "광주시",
      "이천시",
      "양주시",
      "오산시",
      "구리시",
      "안성시",
      "포천시",
      "여주시",
      "동두천시",
      "과천시",
      "가평군",
      "양평군",
      "연천군",
    ],
    강원도: [
      "춘천시",
      "원주시",
      "강릉시",
      "동해시",
      "태백시",
      "속초시",
      "삼척시",
      "홍천군",
      "횡성군",
      "영월군",
      "평창군",
      "정선군",
      "철원군",
      "화천군",
      "양구군",
      "인제군",
      "고성군",
      "양양군",
    ],
    충청북도: [
      "청주시",
      "충주시",
      "제천시",
      "보은군",
      "옥천군",
      "영동군",
      "증평군",
      "진천군",
      "괴산군",
      "음성군",
      "단양군",
    ],
    충청남도: [
      "천안시",
      "공주시",
      "보령시",
      "아산시",
      "서산시",
      "논산시",
      "계룡시",
      "당진시",
      "금산군",
      "부여군",
      "서천군",
      "청양군",
      "홍성군",
      "예산군",
      "태안군",
    ],
    전라북도: [
      "전주시",
      "군산시",
      "익산시",
      "정읍시",
      "남원시",
      "김제시",
      "완주군",
      "진안군",
      "무주군",
      "장수군",
      "임실군",
      "순창군",
      "고창군",
      "부안군",
    ],
    전라남도: [
      "목포시",
      "여수시",
      "순천시",
      "나주시",
      "광양시",
      "담양군",
      "곡성군",
      "구례군",
      "고흥군",
      "보성군",
      "화순군",
      "장흥군",
      "강진군",
      "해남군",
      "영암군",
      "무안군",
      "함평군",
      "영광군",
      "장성군",
      "완도군",
      "진도군",
      "신안군",
    ],
    경상북도: [
      "포항시",
      "경주시",
      "김천시",
      "안동시",
      "구미시",
      "영주시",
      "영천시",
      "상주시",
      "문경시",
      "경산시",
      "군위군",
      "의성군",
      "청송군",
      "영양군",
      "영덕군",
      "청도군",
      "고령군",
      "성주군",
      "칠곡군",
      "예천군",
      "봉화군",
      "울진군",
      "울릉군",
    ],
    경상남도: [
      "창원시",
      "진주시",
      "통영시",
      "사천시",
      "김해시",
      "밀양시",
      "거제시",
      "양산시",
      "의령군",
      "함안군",
      "창녕군",
      "고성군",
      "남해군",
      "하동군",
      "산청군",
      "함양군",
      "거창군",
      "합천군",
    ],
    제주특별자치도: ["제주시", "서귀포시"],
  };

  // 위치 정보 가져오기
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
        },
        () => {
          alert("위치 정보를 가져올 수 없습니다.");
        },
      );
    } else {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    }
  };

  useEffect(() => {
      getUserLocation();
    }, []);
  
  // 시도가 변경될 때마다 구 선택 초기화
  useEffect(() => {
    setDistrict("")
  }, [city])

  useEffect(() => {
      if (loading) {
        setPharmacies([]) // 로딩 중일 때 병원 목록 초기화
      }
    }, [loading])

  // 지역별 약국 검색
  const handleSearch = async () => {
    if (!city || !district) {
      alert("모든 필드를 입력해야 합니다.");
      return;
    }

    setLoading(true)

    const API_KEY =
      "Xcr9KCUMHCL1McVUfmx1J3+bvAyCQaKXKyzIz6/4ZJce9pDbPGXrq+sLzeEmPooR44q8iedR/yOO9ToRc18Rpw==";
    const url =
      "http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire";
    const params = {
      serviceKey: API_KEY,
      Q0: city,
      Q1: district,
      numOfRows: 500,
      pageNo: 1,
      _type: "json",
    };

    try {
      const response = await axios.get(url, { params });
      if (response.data && response.data.response && response.data.response.body) {
        const { items, totalCount } = response.data.response.body

        setPharmacies(items?.item || [])
        setTotalItems(totalCount) // 전체 아이템 수 저장
      } else {
        alert("약국 정보를 찾을 수 없습니다.");
        setPharmacies([]); // 검색 결과가 없으면 목록 초기화
      }
    } catch (error) {
      console.error("Error fetching pharmacy data:", error);
      alert("약국 정보를 가져오는 데 오류가 발생했습니다.");
      setPharmacies([]); // 검색 결과가 없으면 목록 초기화
    } finally {
      setLoading(false);
    }
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  // 시간을 "HH:MM" 형식에서 분 단위로 변환하는 함수
  function parseTime(time) {
    if (typeof time !== "string" || time.length !== 4) {
      console.warn("Invalid time format:", time);
      return null;
    }
    const hours = parseInt(time.substring(0, 2), 10); // 시간 부분 (HH)
    const minutes = parseInt(time.substring(2, 4), 10); // 분 부분 (MM)
    return hours * 60 + minutes; // 시간을 분 단위로 변환하여 반환
  }

  useEffect(() => {
      const fetchHolidays = async () => {
        const today = new Date();
        const year = today.getFullYear();
        const formattedToday = today.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD 형식
    
        // 공공데이터포털 API 호출
        const serviceKey = "Xcr9KCUMHCL1McVUfmx1J3%2BbvAyCQaKXKyzIz6%2F4ZJce9pDbPGXrq%2BsLzeEmPooR44q8iedR%2FyOO9ToRc18Rpw%3D%3D"; // 발급받은 API 키
        const url = `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?ServiceKey=${serviceKey}&solYear=${year}&numOfRows=100`;
    
        try {
          const response = await fetch(url);
          const text = await response.text();
    
          // XML 파싱
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, "text/xml");
          const items = xmlDoc.getElementsByTagName("item");
    
          // 오늘이 공휴일인지 확인
          let isHoliday = false;
          for (let i = 0; i < items.length; i++) {
            const locdate = items[i].getElementsByTagName("locdate")[0].textContent;
            if (locdate === formattedToday) {
              isHoliday = true;
              break;
            }
          }
    
          // 병원 상태 계산
          calculatePharmacyStatus(isHoliday);
        } catch (error) {
          console.error("공휴일 API 호출 오류:", error);
        }
      };
    
      const calculatePharmacyStatus = (isHoliday) => {
        if (pharmacies.length > 0 && userLocation) {
          const pharmaciesWithDistance = pharmacies.map((item) => {
            const pharmacyLat = parseFloat(item.wgs84Lat);
            const pharmacyLon = parseFloat(item.wgs84Lon);
    
            const distance = haversineDistance(
              userLocation.lat,
              userLocation.lon,
              pharmacyLat,
              pharmacyLon
            );
    
            let status = "정보없음";
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();
    
            if (isHoliday) {
              // 공휴일 진료시간 계산
              const holidayStart = item.dutyTime8s ? parseTime(item.dutyTime8s.toString()) : null;
              const holidayEnd = item.dutyTime8c ? parseTime(item.dutyTime8c.toString()) : null;
    
              if (holidayStart !== null && holidayEnd !== null) {
                status =
                  currentTime >= holidayStart && currentTime < holidayEnd
                    ? "진료중"
                    : "진료마감";
              }
            } else {
              // 평일/주말 진료시간 계산
              const dayMapping = {
                0: { start: item.dutyTime7s, end: item.dutyTime7c }, // 일요일
                1: { start: item.dutyTime1s, end: item.dutyTime1c }, // 월요일
                2: { start: item.dutyTime2s, end: item.dutyTime2c }, // 화요일
                3: { start: item.dutyTime3s, end: item.dutyTime3c }, // 수요일
                4: { start: item.dutyTime4s, end: item.dutyTime4c }, // 목요일
                5: { start: item.dutyTime5s, end: item.dutyTime5c }, // 금요일
                6: { start: item.dutyTime6s, end: item.dutyTime6c }, // 토요일
              };
    
              const currentDay = now.getDay();
              if (currentDay in dayMapping) {
                const start =
                  dayMapping[currentDay].start &&
                  parseTime(dayMapping[currentDay].start.toString());
                const end =
                  dayMapping[currentDay].end &&
                  parseTime(dayMapping[currentDay].end.toString());
    
                if (start !== null && end !== null) {
                  status =
                    currentTime >= start && currentTime < end ? "운영중" : "운영마감";
                }
              }
            }
    
            return { ...item, distance, status };
          });
    
          pharmaciesWithDistance.sort((a, b) => a.distance - b.distance);
          setSortedPharmacies(pharmaciesWithDistance);
        } else {
          setSortedPharmacies(pharmacies);
        }
      };
    
      fetchHolidays();
    }, [pharmacies, userLocation]);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

    // 페이지네이션 렌더링 함수
    const renderPagination = () => {
      const totalPages = Math.ceil(totalItems / itemsPerPage)
      const rangeStart = Math.floor((currentPage - 1) / 10) * 10 + 1
      const rangeEnd = Math.min(rangeStart + 9, totalPages)
  
      const pageNumbers = []
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pageNumbers.push(i)
      }

    return (
      <Pagination className='justify-content-center'>
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {pageNumbers.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    )
  }

  // 페이지에 보여줄 데이터만큼 슬라이싱
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPagePharmacies = sortedPharmacies.slice(startIndex, endIndex)

  const navigate = useNavigate()

  const handleClick = (item) => {
    navigate(`/pharmacy/detail/${item.hpid}`, {state: { item }})
  }

  useEffect(() => {
    if (!isBackNavigation) {
      setCity("");
      setDistrict("");
      setPharmacies([]);
      setCurrentPage(1);
      setTotalItems(0);
    }
  }, [isBackNavigation]);

  // 컴포넌트 마운트 시 저장된 상태 복원
  useEffect(() => {
    const savedState = sessionStorage.getItem("searchState");
    if (savedState && isBackNavigation) {
      const state = JSON.parse(savedState);
      setCity(state.city || "");
      setDistrict(state.district || "");
      setPharmacies(state.pharmacies || []);
      setCurrentPage(state.currentPage || 1);
      setTotalItems(state.totalItems || 0)
    }
  }, [isBackNavigation]);

  // 상태 변경 시 저장
  useEffect(() => {
      sessionStorage.setItem(
        "searchState",
        JSON.stringify({
          city,
          district,
          pharmacies,
          currentPage,
          totalItems,
        })
      );
  }, [city, district, pharmacies, currentPage, totalItems])

  // 약국 ID에 따라 리뷰 조회
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          if (currentPagePharmacies.length > 0) {
            const reviewsData = await Promise.all(
              currentPagePharmacies.map(async (pharmacy) => {
                const response = await getReviewsByPharmacy(pharmacy.hpid);
                return response || [];
              })
            );
            const flattenedReviews = reviewsData.flat();
            // 이전 상태와 비교하여 중복 업데이트 방지
            setReviews((prevReviews) =>
              JSON.stringify(prevReviews) !== JSON.stringify(flattenedReviews)
                ? flattenedReviews
                : prevReviews
            );
            console.log("reviews", reviews)
          }
        } catch (error) {
          console.error("리뷰를 가져오는 중 오류 발생:", error);
        }
      };
    
      fetchReviews();
    }, [currentPagePharmacies]);

  return (
    <Container className="mt-4 mb-4 p-5" style={{ maxWidth: "700px" }}>
      <Row className="mb-5">
        <h2 className='fw-bold mb-4'>지역별 약국 검색</h2>
        <Col className='d-flex mb-3 mb-md-0'>
          <Form.Select className="me-2" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">시/도</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            className="me-2"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={!city}
          >
            <option value="">시/군/구</option>
            {(districts[city] || []).map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={4}>
          <Button className="search-button" onClick={() => handleSearch(1)}>
            검색
          </Button>
        </Col>
      </Row>

      <Row>
        {loading ? (
          <p>로딩 중...</p>
        ) : currentPagePharmacies.length > 0 ? (
          <>
            {currentPagePharmacies.map((item) => (
              <Card className="text-center search-card">
                <Card.Body>
                  <Row className='d-flex justify-content-between align-items-center'>
                    <Col className='text-nowrap'>
                      <div className="search-card-header">
                        <Card.Title role='button' onClick={() => handleClick(item)} className="search-card-title">{item.dutyName}</Card.Title>
                        <Card.Text className="search-card-distanc me-1">★</Card.Text>
                        <Card.Text className="search-card-rating">
                        {(() => {
                          const pharmacyReviews = reviews.filter((review) => {
                            // 병원 ID의 데이터 구조에 따라 조건 분기
                            if (typeof review.pharmacyId === "object" && review.pharmacyId !== null) {
                              return String(review.pharmacyId.pharmacyId) === String(item.hpid);
                            }
                            return String(review.pharmacyId) === String(item.hpid);
                          });

                          if (pharmacyReviews.length === 0) return "수집중";

                          const averageRating =
                          pharmacyReviews.reduce((sum, review) => sum + review.rating, 0) /
                          pharmacyReviews.length;

                          return `${averageRating.toFixed(1)} (${pharmacyReviews.length})`;
                        })()}
                        </Card.Text>
                      </div>
                      <div className="d-flex text-nowrap">
                        <Card.Text className="search-card-distanc me-2">
                          {item.distance
                            ? `${item.distance.toFixed(2)} km`
                            : "위치를 찾을 수 없습니다."}
                        </Card.Text>
                        <Card.Text className="search-card-content">
                          {item.dutyAddr.split(" ").slice(0, 2).join(" ")}
                        </Card.Text>
                      </div>
                    </Col>
                    <Col className='d-flex justify-content-end'>
                        <p className="m-0 me-2 fw-bold" style={{ 
                            color: item.status === "운영중" ? "#0052CC" : "#7C7C7C"
                          }}>{item.status}</p>
                        <FavoriteComponent pharmacyId={item.hpid} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
            <div className="mt-4">{renderPagination()}</div>
          </>
        ) : (
          <p>가까운 약국을 검색해보세요. 휴일도 안심이 찾아드립니다.</p>
        )}
      </Row>
    </Container>
  )
}

export default PharmacySearchComponent