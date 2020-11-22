import { Toast } from 'vant';

const Single = () => import('@/view/bdh/ordering/single/single');
const GoodsInfo = () => import('@/view/bdh/ordering/single/goodsInfo');
const Match = () => import('@/view/bdh/ordering/match/match');
const Infer = () => import('@/view/bdh/ordering/infer/infer');
const Exhibit = () => import('@/view/bdh/ordering/exhibit/exhibit');
const DeduceList = () => import('@/view/bdh/ordering/deduceList/deduceList');
const Target = () => import('@/view/my/target');
const Collect = () => import('@/view/my/collect');
const UnusualOrder = () => import('@/view/my/unusualOrder');
const Favorite = () => import('@/view/my/favorite');
const Rank = () => import('@/view/my/rank');
const Pact = () => import('@/view/my/pact');
const PactInfo = () => import('@/view/my/pact/info');
const Audit = () => import('@/view/my/audit');
const AuditInfo = () => import('@/view/my/audit/info');
const Star = () => import('@/view/my/star');
const MyOrder = () => import('@/view/bdh/order/myOrder/myOrder');
const MatchMore = () => import('@/view/more/match');
const ExhibitMore = () => import('@/view/more/exhibit');
const DeduceMore = () => import('@/view/more/deduce');
const DeductionMore = () => import('@/view/more/deduction');
const MatchDetail = () => import('@/view/more/match/matchDetail');
const ExhibitDetail = () => import('@/view/more/exhibit/exhibitDetail');
const DeductionDetail = () => import('@/view/more/deduction/deductionDetail');
const Analyze = () => {
	//异步加载提示
	Toast.loading({
		duration: 0,
		message: '数据加载中...'
	});
	return import('@/view/bdh/order/analyze/analyze').then((res)=>{
		Toast.clear();
		return res;
	})
};

export default [
	{
		path: '/bdh/single',
		name: 'Single',
		component: Single,
		meta: {
			pageTitle: '单款订货',
			keepAlive: true
		}
	},
	{
		path: '/bdh/single/goodsInfo',
		name: 'GoodsInfo',
		component: GoodsInfo,
		meta: {
			pageTitle: '单款详情'
		}
	},
	{
		path: '/bdh/match',
		name: 'Match',
		component: Match
	},
	{
		path: '/bdh/infer',
		name: 'Infer',
		component: Infer
	},
	{
		path: '/bdh/exhibit',
		name: 'Exhibit',
		component: Exhibit
	},
	{
		path: '/bdh/deduceList',
		name: 'DeduceList',
		component: DeduceList
	},
	{
		path: '/bdh/myOrder',
		name: 'MyOrder',
		component: MyOrder,
		meta: {
			pageTitle: '我的订单'
		}
	},
	{
		path: '/bdh/analyze',
		name: 'Analyze',
		component: Analyze,
		meta: {
			pageTitle: '订单分析'
		}
	},
	{
		path: '/my/target',
		name: 'Target',
		component: Target
	},
	{
		path: '/my/collect',
		name: 'Collect',
		component: Collect
	},
	{
		path: '/my/unusualOrder',
		name: 'UnusualOrder',
		component: UnusualOrder
	},
	{
		path: '/my/favorite',
		name: 'Favorite',
		component: Favorite
	},
	{
		path: '/my/rank',
		name: 'Rank',
		component: Rank
	},
	{
		path: '/my/pact',
		name: 'Pact',
		component: Pact,
		meta: {
			pageTitle: '电子合同'
		}
	},
	{
		path: '/my/pactInfo',
		name: 'PactInfo',
		component: PactInfo,
		meta: {
			pageTitle: '详情'
		}
	},
	{
		path: '/my/audit',
		name: 'Audit',
		component: Audit,
		meta: {
			pageTitle: '订单审核'
		}
	},
	{
		path: '/my/auditInfo',
		name: 'AuditInfo',
		component: AuditInfo,
		meta: {
			pageTitle: '订单审核详情'
		}
	},
	{
		path: '/my/star',
		name: 'Star',
		component: Star
	},
	{
		path: '/more/match',
		name: 'MatchMore',
		component: MatchMore
	},
	{
		path: '/more/exhibit',
		name: 'ExhibitMore',
		component: ExhibitMore
	},
	{
		path: '/more/deduce',
		name: 'DeduceMore',
		component: DeduceMore
	},
	{
		path: '/more/deduction',
		name: 'DeductionMore',
		component: DeductionMore
	},
	{
		path: '/more/match/matchDetail',
		name: 'MatchDetail',
		component: MatchDetail
	},
	{
		path: '/more/exhibit/exhibitDetail',
		name: 'ExhibitDetail',
		component: ExhibitDetail
	},
	{
		path: '/more/dedution/deductionDetail',
		name: 'DeductionDetail',
		component: DeductionDetail
	},
]