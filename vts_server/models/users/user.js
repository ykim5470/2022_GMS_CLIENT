const Sequelize = require('sequelize');
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        email: {
          // id 및 email
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true,
        },
        password: {
          // hash 비밀번호
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        provider: {
          // local=로컬, kakao=카카오
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: 'local',
        },
        snsId: {
          // SNS 고유 ID (kakao)
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        auth: {
          // 0=사용자, 121=가이드, 125=가이드 관리자, 151=셀러, 155=셀러 관리자, 177=시스템 관리자
          type: Sequelize.INTEGER,
          allowNull: false,
          // defaultValue: “0”,
        },
        confirm: {
          // 10 : 승인 대기중, 44 = 반려, 54 = 승인취소, 99 = 승인
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        status: {
          // 700=정상, 704=인증필요, 708=휴먼, 709=정지
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: 700,
        },
        nick: {
          // 사용자 이름
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        nickName: {
          // 사용자 별명
          type: Sequelize.STRING(20),
          allowNull: true,
          // is : /\s/gi,
        },
        approvalid: {
          // 최종 승인자
          type: Sequelize.STRING(15),
          allowNull: true,
        },
        //------------------------------------------
        // passwordFail: {
        //   // 비밀번호 실패
        //   type: Sequelize.INTEGER,
        //   defaultValue: “0”,
        // },
        // emailTime: {
        //   // 토큰을 보낸 시간
        //   type: Sequelize.DATE,
        //   allowNull: true,
        // },
        // emailToken: {
        //   // 랜덤 토큰
        //   type: Sequelize.STRING(200),
        //   allowNull: true,
        // },
        // emailAuth: {
        //   // Null=불법 회원가입, 300=이메일 미인증, 311=승인 대기중, 344=비밀번호 실패, 355=비밀번호 찾기, 399=인증
        //   type: Sequelize.INTEGER,
        //   allowNull: true,
        // },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'User',
        tableName: 'user',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
};