package safe_holiday.safe_holiday.security.handler;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import safe_holiday.safe_holiday.dto.SafeMemberDTO;
import safe_holiday.safe_holiday.util.JWTUtil;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Slf4j
public class APILoginSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("로그인 성공 후 인증 정보 : {}", authentication);
        //인증된 사용자의 정보(authentication.getPrincipal())를 반환
        SafeMemberDTO memberDTO = (SafeMemberDTO) authentication.getPrincipal();

        //사용자의 클레임 데이터를 가져온다
        Map<String, Object> claims = memberDTO.getClaims();

        //JWTUtil을 이용해서 Access Token과 Refresh Token을 생성한다.
        String accessToken = JWTUtil.generateToken(claims, 10);
        String refreshToken = JWTUtil.generateToken(claims, 60 * 24);

        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);

        //JSON 응답 생성을 위해, Gson 라이브러리를 사용해 클레임 데이터를 JSON 형식으로 변환
        Gson gson = new Gson();
        String jsonStr = gson.toJson(claims);

        //HTTP 응답으로 반환
        response.setContentType("application/json; charset=UTF-8");
        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);
        printWriter.close();
    }
}
