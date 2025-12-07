import type {
  NavigationLink,
  CTAButton,
  HeroContent,
  FeaturesContent,
  Feature,
  FooterLink,
} from '../types/landing.types'

export const NAVIGATION_LINKS: NavigationLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Docs', href: 'https://www.notion.so/ajy720/SoftBank-Hackathon-2025-Team-Yellow-2b9a0048876b80359945da260b4bc659', isExternal: true },
  { label: 'GitHub', href: 'https://github.com/Softbank-Hackathon-2025-Team-Yellow', isExternal: true },
]

export const HERO_CONTENT: HeroContent = {
  headline: 'Call it. It runs.',
  description: {
    ko: 'Runna는 당신을 위한 미니멀 서버리스 엔진입니다.\n필요할 때는 즉시 달리고, 필요 없을 때는 완전히 멈춥니다.\n제로 스케일링으로 최고의 비용 효율성을 실현하세요.',
    ja: 'Runnaは、あなたのためのミニマルなサーバーレスエンジンです。\n必要なときは即座に走り、不要なときは完全に停止します。\nゼロスケールで最高のコスト効率を実現しましょう。',
  },
}

export const CTA_BUTTONS: { primary: CTAButton; secondary: CTAButton } = {
  primary: { label: 'Get Started', href: '/login' },
  secondary: { label: 'View Demo', href: '/gallery' },
}

export const FEATURES_CONTENT: FeaturesContent = {
  heading: 'Simple, Fast, and Efficient',
  subheading: {
    ko: '심플함과 성능을 중시하는 개발자를 위해 설계되었습니다. 최소한의 설정으로 함수를 빠르게 실행할 수 있습니다.',
    ja: 'シンプルさとパフォーマンスを重視する開発者のために設計されています。最小限の設定で関数を素早く実行できます。',
  },
}

export const FEATURES: Feature[] = [
  {
    id: 'multi-tenancy',
    title: 'Multi-Tenancy',
    description: {
      ko: '각 함수별 리소스 환경을 완벽하게 격리하여 안전하고 독립적인 실행 환경을 제공합니다.',
      ja: '各関数ごとにリソース環境を完全に分離し、安全で独立した実行環境を提供します。',
    },
    icon: 'layers',
  },
  {
    id: 'instant-deploy',
    title: 'Instant Deploy & Execution',
    description: {
      ko: '버튼 클릭과 함께 콜드스타트 없이 즉시 배포하고 실행할 수 있습니다. 수정도 즉각 반영됩니다.',
      ja: 'ボタンクリックでコールドスタートなしに即座にデプロイして実行できます。修正も即座に反映されます。',
    },
    icon: 'zap',
  },
  {
    id: 'flexible-traffic',
    title: 'Flexible Traffic Handling',
    description: {
      ko: '자동 스케일러 알고리즘과 Request Concurrency 기반 스케일링으로 유연하게 트래픽을 처리합니다.',
      ja: '自動スケーラーアルゴリズムとRequest Concurrencyベースのスケーリングで柔軟にトラフィックを処理します。',
    },
    icon: 'activity',
  },
  {
    id: 'cost-optimization',
    title: 'Zero-Scaling',
    description: {
      ko: '함수 호출이 없을 때는 제로 스케일링으로 비용을 절감합니다.',
      ja: '関数呼び出しがない場合は、ゼロスケーリングでコストを削減します。',
    },
    icon: 'dollar-sign',
  },
  {
    id: 'custom-routing',
    title: 'Custom Routing',
    description: {
      ko: '워크스페이스 네임 기반 버추얼호스트와 함수별 커스텀 라우트를 제공합니다.',
      ja: 'ワークスペース名ベースのバーチャルホストと関数ごとのカスタムルートを提供します。',
    },
    icon: 'route',
  },
  {
    id: 'real-time-metrics',
    title: 'Real-time Metrics',
    description: {
      ko: '현재 함수 상태 및 메트릭 정보를 실시간으로 확인할 수 있습니다.',
      ja: '現在の関数状態とメトリクス情報をリアルタイムで確認できます。',
    },
    icon: 'bar-chart',
  },
]

export const FOOTER_LINKS: FooterLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Docs', href: 'https://www.notion.so/ajy720/SoftBank-Hackathon-2025-Team-Yellow-2b9a0048876b80359945da260b4bc659' },
  { label: 'GitHub', href: 'https://github.com/Softbank-Hackathon-2025-Team-Yellow' },
  { label: 'Contact', href: '#contact' },
]

export const COPYRIGHT_TEXT = '© 2025 Runna — SoftBank Hackathon 2025, Yellow Team'
