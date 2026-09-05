'use client';
import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Search,
  ShoppingBag,
  Menu,
  Plus,
  Minus,
  X,
  Check,
  Truck,
  RotateCcw,
  Lock,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Empty, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { products, type Product } from './products';
type Line = { id: string; size: string; qty: number };
const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    n,
  );
const categories = [
  'All pieces',
  'T-shirts',
  'Sweatshirts',
  'Outerwear',
  'Bottoms',
  'Accessories',
];
export default function Store() {
  const [view, setView] = useState('home'),
    [selected, setSelected] = useState<Product>(),
    [size, setSize] = useState(''),
    [sizeError, setSizeError] = useState(false);
  const [cart, setCart] = useState<Line[]>([]),
    [ready, setReady] = useState(false),
    [bag, setBag] = useState(false),
    [menu, setMenu] = useState(false);
  const [category, setCategory] = useState('All pieces'),
    [query, setQuery] = useState(''),
    [sort, setSort] = useState('featured'),
    [price, setPrice] = useState('all'),
    [filters, setFilters] = useState(false),
    [info, setInfo] = useState('');
  const [step, setStep] = useState(1),
    [shipping, setShipping] = useState('standard'),
    [placing, setPlacing] = useState(false),
    [storageWarning, setStorageWarning] = useState(false);
  const [address, setAddress] = useState({
    email: '',
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [order, setOrder] = useState<{
    id: string;
    total: number;
    count: number;
  } | null>(null);
  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(location.search);
      const p = products.find((p) => p.id === params.get('product'));
      setSelected(p);
      setSize('');
      setSizeError(false);
      setView(
        params.has('product')
          ? p
            ? 'product'
            : 'missing'
          : params.get('view') === 'checkout'
            ? 'checkout'
            : 'home',
      );
    };
    sync();
    window.addEventListener('popstate', sync);
    try {
      const saved = JSON.parse(
        localStorage.getItem('form-after-bag-v1') || '[]',
      );
      if (Array.isArray(saved))
        setCart(
          saved
            .filter(
              (l) =>
                products.some(
                  (p) => p.id === l.id && p.sizes.includes(l.size),
                ) &&
                Number.isInteger(l.qty) &&
                l.qty > 0,
            )
            .map((l) => ({ id: l.id, size: l.size, qty: Math.min(5, l.qty) })),
        );
    } catch {
      setStorageWarning(true);
    }
    setReady(true);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem('form-after-bag-v1', JSON.stringify(cart));
      } catch {
        setStorageWarning(true);
      }
  }, [cart, ready]);
  useEffect(() => {
    document.title =
      view === 'product' && selected
        ? `${selected.name} — FORM / AFTER`
        : view === 'checkout'
          ? 'Checkout — FORM / AFTER'
          : 'FORM / AFTER — Uniforms for the in-between';
  }, [view, selected]);
  const navigate = (next: string, p?: Product) => {
    history.pushState(
      {},
      '',
      next === 'product'
        ? `?product=${p!.id}`
        : next === 'checkout'
          ? '?view=checkout'
          : location.pathname,
    );
    setView(next);
    setSelected(p);
    setSize('');
    setSizeError(false);
    setMenu(false);
    setBag(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const shop = (cat = 'All pieces') => {
    setCategory(cat);
    setQuery('');
    setPrice('all');
    navigate('home');
    setTimeout(
      () =>
        document
          .getElementById('collection')
          ?.scrollIntoView({ behavior: 'smooth' }),
      50,
    );
  };
  const count = cart.reduce((n, l) => n + l.qty, 0),
    subtotal = cart.reduce(
      (n, l) => n + products.find((p) => p.id === l.id)!.price * l.qty,
      0,
    ),
    delivery = shipping === 'express' ? 18 : subtotal >= 180 ? 0 : 8,
    total = subtotal + delivery;
  const shown = products
    .filter(
      (p) =>
        (category === 'All pieces' || p.category === category) &&
        `${p.name} ${p.category} ${p.color} ${p.description}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()) &&
        (price === 'all' ||
          (price === 'under100' ? p.price < 100 : p.price >= 100)),
    )
    .sort((a, b) =>
      sort === 'low'
        ? a.price - b.price
        : sort === 'high'
          ? b.price - a.price
          : sort === 'az'
            ? a.name.localeCompare(b.name)
            : a.rank - b.rank,
    );
  const add = () => {
    if (!selected) return;
    if (!size) {
      setSizeError(true);
      return;
    }
    setCart((prev) => {
      const line = prev.find((l) => l.id === selected.id && l.size === size);
      return line
        ? prev.map((l) =>
            l === line ? { ...l, qty: Math.min(5, l.qty + 1) } : l,
          )
        : [...prev, { id: selected.id, size, qty: 1 }];
    });
    setBag(true);
  };
  const update = (line: Line, change: number) =>
    setCart((prev) =>
      prev
        .map((l) =>
          l.id === line.id && l.size === line.size
            ? { ...l, qty: Math.min(5, l.qty + change) }
            : l,
        )
        .filter((l) => l.qty > 0),
    );
  const remove = (line: Line) =>
    setCart((prev) =>
      prev.filter((l) => !(l.id === line.id && l.size === line.size)),
    );
  const placeOrder = () => {
    if (placing || !count) return;
    setPlacing(true);
    setTimeout(() => {
      setOrder({
        id: `FA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        total,
        count,
      });
      setCart([]);
      setPlacing(false);
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 650);
  };
  const card = (p: Product) => (
    <article className="product-card" key={p.id}>
      <a
        className="product-photo"
        href={`?product=${p.id}`}
        aria-label={`View ${p.name}`}
        onClick={(e) => {
          e.preventDefault();
          navigate('product', p);
        }}
      >
        <img
          src={p.image}
          alt={`${p.name} in ${p.color}`}
          loading="lazy"
          width="700"
          height="875"
        />
        <span className="product-tag">{p.tag}</span>
        <span className="product-open">
          <ArrowUpRight size={20} />
        </span>
      </a>
      <div className="product-caption">
        <div>
          <a
            href={`?product=${p.id}`}
            onClick={(e) => {
              e.preventDefault();
              navigate('product', p);
            }}
          >
            {p.name}
          </a>
          <p>
            {p.color}
            <span> / </span>
            {p.fit}
          </p>
        </div>
        <span>{money(p.price)}</span>
      </div>
    </article>
  );
  const cartLines = (editable = true) =>
    cart.map((l) => {
      const p = products.find((p) => p.id === l.id)!;
      return (
        <div className="bag-line" key={`${l.id}-${l.size}`}>
          <img src={p.image} alt={p.name} width="90" height="110" />
          <div className="bag-line-body">
            <button
              className="text-link"
              onClick={() => navigate('product', p)}
            >
              {p.name}
            </button>
            <p>
              {p.color} / {l.size}
            </p>
            {editable ? (
              <div className="quantity">
                <button
                  aria-label={`Decrease ${p.name} quantity`}
                  onClick={() => update(l, -1)}
                >
                  <Minus size={14} />
                </button>
                <span>{l.qty}</span>
                <button
                  aria-label={`Increase ${p.name} quantity`}
                  disabled={l.qty >= 5}
                  onClick={() => update(l, 1)}
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <p>Quantity: {l.qty}</p>
            )}
          </div>
          <div className="line-end">
            <span>{money(p.price * l.qty)}</span>
            {editable && (
              <button aria-label={`Remove ${p.name}`} onClick={() => remove(l)}>
                <X size={17} />
              </button>
            )}
          </div>
        </div>
      );
    });
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="announcement">
        <span>INDEPENDENT SPIRIT. EVERYDAY UNIFORM.</span>
        <span>
          Complimentary US shipping on orders $180+ <ArrowUpRight size={13} />
        </span>
        <span>VOL. 01 — FALL 2026</span>
      </div>
      <header className="site-header">
        <button
          className="mobile-menu icon-button"
          aria-label="Open navigation"
          onClick={() => setMenu(true)}
        >
          <Menu />
        </button>
        <a
          className="wordmark"
          href="?"
          onClick={(e) => {
            e.preventDefault();
            navigate('home');
          }}
        >
          FORM<span>/</span>AFTER<sup>®</sup>
        </a>
        <nav aria-label="Main navigation">
          <button onClick={() => shop()}>Shop all</button>
          <button onClick={() => shop('Outerwear')}>Outerwear</button>
          <button
            onClick={() => {
              navigate('home');
              setTimeout(
                () =>
                  document
                    .getElementById('studio')
                    ?.scrollIntoView({ behavior: 'smooth' }),
                50,
              );
            }}
          >
            The studio <ArrowUpRight size={14} />
          </button>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Search products"
            onClick={() => {
              shop();
              setTimeout(() => document.getElementById('search')?.focus(), 250);
            }}
          >
            <Search size={21} />
          </button>
          <button
            className="bag-button"
            aria-label={`Open bag, ${count} items`}
            onClick={() => setBag(true)}
          >
            <ShoppingBag size={20} />
            <span className="bag-label">Bag</span>
            <span className="bag-count">{count}</span>
          </button>
        </div>
      </header>
      <main id="main">
        {view === 'home' && (
          <>
            <section className="hero">
              <img
                src="/images/hero.jpg"
                alt="Streetwear in the city: black outerwear against brutalist concrete"
                fetchPriority="high"
                width="1800"
                height="1000"
              />
              <div className="hero-shade" />
              <div className="hero-top">
                <span>
                  <i /> THE FIRST CHAPTER
                </span>
                <span>COLLECTION 001 / 2026</span>
              </div>
              <div className="hero-copy">
                <p>FOR THE HOURS THAT ARE YOURS.</p>
                <h1>
                  OUTSIDE
                  <br />
                  THE ORDINARY.
                </h1>
                <div className="hero-bottom">
                  <p>
                    Considered pieces. Uncompromising character.
                    <br />A uniform for wherever you go next.
                  </p>
                  <button className="button white" onClick={() => shop()}>
                    Explore the collection <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>
              <span className="hero-side">FORM WITHOUT FORMULA.</span>
            </section>
            <div className="brand-strip">
              <span>DESIGNED WITH INTENT.</span>
              <span>01 / HEAVYWEIGHT FABRICS</span>
              <span>02 / CONSIDERED PROPORTIONS</span>
              <span>03 / EVERYDAY ROTATION</span>
            </div>
            <section className="collection section" id="collection">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">THE EVERYDAY, RECONSIDERED</p>
                  <h2>
                    The current rotation<span> (08)</span>
                  </h2>
                </div>
                <p>
                  Built to be worn.
                  <br />
                  Made to be your own.
                </p>
              </div>
              <div className="catalog-toolbar">
                <div className="category-list" aria-label="Product categories">
                  {categories.map((c) => (
                    <button
                      key={c}
                      aria-pressed={category === c}
                      className={category === c ? 'active' : ''}
                      onClick={() => setCategory(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <button
                  className="filter-toggle"
                  aria-expanded={filters}
                  onClick={() => setFilters(!filters)}
                >
                  <SlidersHorizontal size={16} /> Filters{' '}
                  {price !== 'all' && '(1)'}
                </button>
              </div>
              <div className="search-row">
                <label className="search-field">
                  <Search size={17} />
                  <input
                    id="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Find your next essential"
                    aria-label="Search the collection"
                  />
                  {query && (
                    <button
                      aria-label="Clear search"
                      onClick={() => setQuery('')}
                    >
                      <X size={16} />
                    </button>
                  )}
                </label>
                <span className="result-count" aria-live="polite">
                  {shown.length} pieces
                </span>
                <Select
                  value={sort}
                  onValueChange={(v) => setSort(v || 'featured')}
                >
                  <SelectTrigger
                    aria-label="Sort products"
                    className="sort-select"
                  >
                    <SelectValue>
                      {
                        {
                          featured: 'Featured',
                          low: 'Price: low to high',
                          high: 'Price: high to low',
                          az: 'Name: A–Z',
                        }[sort]
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      ['featured', 'Featured'],
                      ['low', 'Price: low to high'],
                      ['high', 'Price: high to low'],
                      ['az', 'Name: A–Z'],
                    ].map(([v, l]) => (
                      <SelectItem key={v} value={v}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {filters && (
                <div className="filter-panel">
                  <span>Price</span>
                  {[
                    ['all', 'All prices'],
                    ['under100', 'Under $100'],
                    ['100plus', '$100 and above'],
                  ].map(([v, l]) => (
                    <button
                      key={v}
                      aria-pressed={price === v}
                      className={price === v ? 'active' : ''}
                      onClick={() => setPrice(v)}
                    >
                      {l}
                    </button>
                  ))}
                  <button
                    className="text-link"
                    onClick={() => {
                      setPrice('all');
                      setQuery('');
                      setCategory('All pieces');
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              )}
              {shown.length ? (
                <div className="product-grid">{shown.map(card)}</div>
              ) : (
                <Empty className="empty-state">
                  <Search size={30} />
                  <EmptyTitle>No pieces found</EmptyTitle>
                  <EmptyDescription>
                    Try another search or give your filters a fresh start.
                  </EmptyDescription>
                  <button
                    className="button black"
                    onClick={() => {
                      setQuery('');
                      setCategory('All pieces');
                      setPrice('all');
                    }}
                  >
                    Clear all filters <ArrowRight size={18} />
                  </button>
                </Empty>
              )}
            </section>
            <section id="studio" className="studio">
              <div className="studio-mark">
                F<span>/</span>A<sup>®</sup>
                <p>INDEPENDENT BY DESIGN.</p>
              </div>
              <div className="studio-copy">
                <p className="eyebrow">THE FORM / AFTER APPROACH</p>
                <h2>
                  Less noise.
                  <br />
                  More character.
                </h2>
                <p>
                  We make clothes for the space between plans. The early train.
                  The long way home. The nights that become mornings.
                </p>
                <p>
                  Good weight. Clean lines. Room to move. Eight considered
                  pieces, designed to work together and stand on their own.
                </p>
                <button className="text-link" onClick={() => shop()}>
                  Find your uniform <ArrowUpRight size={18} />
                </button>
              </div>
            </section>
          </>
        )}
        {view === 'product' && selected && (
          <section className="product-detail section">
            <button className="back-link" onClick={() => shop()}>
              <ArrowLeft size={16} /> Back to the collection
            </button>
            <div className="detail-grid">
              <div className="detail-image">
                <img
                  src={selected.image}
                  alt={`${selected.name} in ${selected.color}`}
                  width="800"
                  height="1000"
                />
                <span className="product-tag">{selected.tag}</span>
              </div>
              <div className="detail-info">
                <p className="eyebrow">FORM / AFTER — COLLECTION 001</p>
                <h1>{selected.name}</h1>
                <p className="detail-price">
                  {money(selected.price)} <span>USD</span>
                </p>
                <p className="description">{selected.description}</p>
                <div className="color-line">
                  <span
                    className="swatch"
                    style={{ background: selected.hex }}
                  />
                  {selected.color}
                </div>
                <div className="size-heading">
                  <span>Select size {size && `— ${size}`}</span>
                  <button
                    className="text-link"
                    onClick={() => setInfo('Size guide')}
                  >
                    Size guide
                  </button>
                </div>
                <RadioGroup
                  value={size}
                  onValueChange={(v) => {
                    setSize(String(v));
                    setSizeError(false);
                  }}
                  aria-label="Size"
                  className="size-options"
                >
                  {selected.sizes.map((s) => (
                    <label
                      className={`size-option ${size === s ? 'chosen' : ''}`}
                      key={s}
                    >
                      <RadioGroupItem value={s} aria-label={s} />
                      <span>{s}</span>
                    </label>
                  ))}
                </RadioGroup>
                {sizeError && (
                  <p role="alert" className="error-text">
                    Choose a size to add this piece to your bag.
                  </p>
                )}
                <button className="button black add-button" onClick={add}>
                  Add to bag — {money(selected.price)} <Plus size={20} />
                </button>
                <p className="stock">
                  <i /> In stock · Ready for your rotation
                </p>
                <div className="detail-benefits">
                  <span>
                    <Truck size={19} /> Free US shipping over $180
                  </span>
                  <span>
                    <RotateCcw size={18} /> Returns within 30 days
                  </span>
                </div>
                <details open>
                  <summary>Design & details</summary>
                  <p>
                    {selected.material}. {selected.fit} fit. {selected.details}
                  </p>
                </details>
                <details>
                  <summary>Fit & care</summary>
                  <p>
                    Choose your usual size for an easy, everyday fit.{' '}
                    {selected.care}
                  </p>
                </details>
                <details>
                  <summary>Shipping & returns</summary>
                  <p>
                    Standard US delivery: 4–7 business days ($8, free over
                    $180). Express: 2–3 business days ($18). Unworn items may be
                    returned within 30 days. This fictional storefront does not
                    ship demo orders.
                  </p>
                </details>
              </div>
            </div>
            <div className="section-heading related-heading">
              <h2>Keep good company.</h2>
              <span>COMPLETE YOUR ROTATION</span>
            </div>
            <div className="product-grid related">
              {products
                .filter((p) => p.id !== selected.id)
                .slice(0, 4)
                .map(card)}
            </div>
          </section>
        )}
        {view === 'missing' && (
          <Empty className="empty-state">
            <EmptyTitle>This piece isn’t in the collection.</EmptyTitle>
            <button className="button black" onClick={() => shop()}>
              Explore all pieces <ArrowRight size={18} />
            </button>
          </Empty>
        )}
        {view === 'checkout' && (
          <section className="checkout section">
            {step === 3 && order ? (
              <div className="confirmation">
                <span className="success-icon">
                  <Check size={30} />
                </span>
                <p className="eyebrow">YOUR NEXT ROTATION</p>
                <h1>You’re all set.</h1>
                <p>
                  Your demo order <strong>{order.id}</strong> is confirmed.
                </p>
                <div className="receipt">
                  <span>
                    {order.count} {order.count === 1 ? 'piece' : 'pieces'}
                  </span>
                  <strong>{money(order.total)}</strong>
                </div>
                <p>
                  No payment was collected. This fictional order won’t be
                  shipped, and no confirmation email is sent.
                </p>
                <button
                  className="button black"
                  onClick={() => {
                    setStep(1);
                    setOrder(null);
                    setShipping('standard');
                    setAddress({
                      email: '',
                      name: '',
                      street: '',
                      city: '',
                      state: '',
                      zip: '',
                    });
                    shop();
                  }}
                >
                  Back to the collection <ArrowRight size={18} />
                </button>
              </div>
            ) : !count ? (
              <Empty className="empty-state">
                <ShoppingBag size={34} />
                <EmptyTitle>Your bag is waiting.</EmptyTitle>
                <EmptyDescription>
                  A good rotation starts with one piece.
                </EmptyDescription>
                <button className="button black" onClick={() => shop()}>
                  Explore the collection <ArrowRight size={18} />
                </button>
              </Empty>
            ) : (
              <>
                <button className="back-link" onClick={() => setBag(true)}>
                  <ArrowLeft size={16} /> Edit your bag
                </button>
                <h1>Make it yours.</h1>
                <div className="checkout-layout">
                  <div>
                    <div className="checkout-steps">
                      <button
                        className={step === 1 ? 'active' : ''}
                        onClick={() => setStep(1)}
                      >
                        01 Information
                      </button>
                      <span>→</span>
                      <span className={step === 2 ? 'active' : ''}>
                        02 Review & pay
                      </span>
                    </div>
                    <p className="demo-notice">
                      <Lock size={16} /> Demo checkout. Use sample details. No
                      real payment.
                    </p>
                    {step === 1 ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setStep(2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <h2>Contact & delivery</h2>
                        {(
                          [
                            ['email', 'Email address', 'you@example.com'],
                            ['name', 'Full name', 'Alex Morgan'],
                            [
                              'street',
                              'Street address',
                              '123 Studio Street, Apt 4',
                            ],
                            ['city', 'City', 'Brooklyn'],
                            ['state', 'State / region', 'New York'],
                            ['zip', 'ZIP code', '11201'],
                          ] as const
                        ).map(([key, label, placeholder]) => (
                          <label key={key}>
                            {label}
                            <input
                              required
                              type={key === 'email' ? 'email' : 'text'}
                              autoComplete={
                                {
                                  email: 'email',
                                  name: 'name',
                                  street: 'street-address',
                                  city: 'address-level2',
                                  state: 'address-level1',
                                  zip: 'postal-code',
                                }[key]
                              }
                              value={address[key]}
                              onChange={(e) =>
                                setAddress({
                                  ...address,
                                  [key]: e.target.value,
                                })
                              }
                              placeholder={placeholder}
                              pattern={
                                key === 'zip'
                                  ? '[0-9]{5}(-[0-9]{4})?'
                                  : '.*\\S.*'
                              }
                              title={
                                key === 'zip'
                                  ? 'Enter a 5-digit US ZIP code'
                                  : 'Enter your ' + label.toLowerCase()
                              }
                              inputMode={key === 'zip' ? 'numeric' : undefined}
                            />
                          </label>
                        ))}
                        <p className="country-note">
                          Country: United States · USD
                        </p>
                        <h2>Shipping method</h2>
                        <RadioGroup
                          value={shipping}
                          onValueChange={(v) => setShipping(String(v))}
                          aria-label="Shipping method"
                        >
                          <label className="shipping-option">
                            <RadioGroupItem value="standard" />
                            <span>
                              Standard delivery<small>4–7 business days</small>
                            </span>
                            <strong>
                              {subtotal >= 180 ? 'Free' : '$8.00'}
                            </strong>
                          </label>
                          <label className="shipping-option">
                            <RadioGroupItem value="express" />
                            <span>
                              Express delivery<small>2–3 business days</small>
                            </span>
                            <strong>$18.00</strong>
                          </label>
                        </RadioGroup>
                        <button type="submit" className="button black full">
                          Continue to review <ArrowRight size={18} />
                        </button>
                      </form>
                    ) : (
                      <div className="review">
                        <h2>Review your order</h2>
                        <div className="review-address">
                          <button
                            className="text-link"
                            onClick={() => setStep(1)}
                          >
                            Edit
                          </button>
                          <h3>Deliver to</h3>
                          <p>
                            {address.name}
                            <br />
                            {address.street}
                            <br />
                            {address.city}, {address.state} {address.zip}
                            <br />
                            United States
                          </p>
                          <p>{address.email}</p>
                        </div>
                        <div className="review-address">
                          <h3>
                            {shipping === 'express' ? 'Express' : 'Standard'}{' '}
                            delivery
                          </h3>
                          <p>
                            {shipping === 'express' ? '2–3' : '4–7'} business
                            days · {money(delivery)}
                          </p>
                        </div>
                        <div className="payment-demo">
                          <Lock size={22} />
                          <h3>Demo payment</h3>
                          <p>
                            Your sample order is ready. No card details needed
                            and no payment will be collected.
                          </p>
                          <span>DEMO CARD ···· 4242</span>
                        </div>
                        <button
                          className="button black full"
                          disabled={placing}
                          onClick={placeOrder}
                        >
                          {placing
                            ? 'Placing demo order…'
                            : `Place demo order — ${money(total)}`}{' '}
                          <ArrowRight size={18} />
                        </button>
                        <p className="checkout-fine">
                          This is a fictional store. No purchase or shipment is
                          created.
                        </p>
                      </div>
                    )}
                  </div>
                  <aside className="order-summary">
                    <h2>
                      In your bag <span>({count})</span>
                    </h2>
                    {cartLines(false)}
                    <div className="totals">
                      <p>
                        <span>Subtotal</span>
                        <span>{money(subtotal)}</span>
                      </p>
                      <p>
                        <span>Shipping</span>
                        <span>
                          {delivery ? money(delivery) : 'Complimentary'}
                        </span>
                      </p>
                      <p>
                        <span>Tax (demo)</span>
                        <span>$0.00</span>
                      </p>
                      <p className="grand-total">
                        <span>
                          Total <small>USD</small>
                        </span>
                        <strong>{money(total)}</strong>
                      </p>
                    </div>
                    <p className="summary-note">
                      Thoughtful pieces. A better everyday.
                    </p>
                  </aside>
                </div>
              </>
            )}
          </section>
        )}
      </main>
      <section className="service-strip">
        <span>
          <Truck size={21} />
          <span>
            Complimentary US shipping<small>On all orders $180+</small>
          </span>
        </span>
        <span>
          <RotateCcw size={21} />
          <span>
            Room to change your mind
            <small>30-day returns on unworn pieces</small>
          </span>
        </span>
        <span>
          <ShoppingBag size={21} />
          <span>
            Your everyday rotation
            <small>Considered from the first stitch</small>
          </span>
        </span>
      </section>
      <footer>
        <div className="footer-top">
          <a
            className="wordmark"
            href="?"
            onClick={(e) => {
              e.preventDefault();
              navigate('home');
            }}
          >
            FORM<span>/</span>AFTER<sup>®</sup>
          </a>
          <p>Uniforms for the in-between.</p>
          <div>
            {['Shipping & returns', 'Size guide', 'About the studio'].map(
              (v) => (
                <button key={v} onClick={() => setInfo(v)}>
                  {v} <ArrowUpRight size={14} />
                </button>
              ),
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 FORM / AFTER</span>
          <span>Fictional brand · Demo store · No real transactions</span>
          <span>UNITED STATES / USD</span>
        </div>
      </footer>
      <Sheet open={bag} onOpenChange={setBag}>
        <SheetContent className="bag-sheet">
          <SheetTitle className="bag-title">
            Your bag <span>({count})</span>
          </SheetTitle>
          <SheetDescription>Good pieces. Better together.</SheetDescription>
          {storageWarning && (
            <p className="error-text">
              Your browser cannot save this bag between visits.
            </p>
          )}
          {count ? (
            <>
              <p className="shipping-progress">
                {subtotal >= 180
                  ? 'Your order qualifies for complimentary shipping.'
                  : `${money(180 - subtotal)} away from complimentary US shipping.`}
              </p>
              <div className="progress-track">
                <span
                  style={{ width: `${Math.min((subtotal / 180) * 100, 100)}%` }}
                />
              </div>
              <div className="bag-items">{cartLines()}</div>
              <div className="bag-footer">
                <p>
                  <span>Subtotal</span>
                  <strong>{money(subtotal)}</strong>
                </p>
                <p className="muted">Shipping calculated at checkout. USD.</p>
                <button
                  className="button black full"
                  onClick={() => {
                    setStep(1);
                    navigate('checkout');
                  }}
                >
                  Checkout <ArrowRight size={18} />
                </button>
                <button
                  className="continue-shopping"
                  onClick={() => setBag(false)}
                >
                  Continue shopping
                </button>
              </div>
            </>
          ) : (
            <Empty className="empty-state">
              <ShoppingBag size={34} />
              <EmptyTitle>Your bag is waiting.</EmptyTitle>
              <EmptyDescription>
                Find a piece that feels like you.
              </EmptyDescription>
              <button className="button black" onClick={() => shop()}>
                Explore the collection <ArrowRight size={18} />
              </button>
            </Empty>
          )}
        </SheetContent>
      </Sheet>
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="menu-sheet">
          <SheetTitle>FORM / AFTER</SheetTitle>
          <SheetDescription>The current rotation</SheetDescription>
          {categories.map((c) => (
            <button key={c} onClick={() => shop(c)}>
              {c} <ArrowUpRight size={20} />
            </button>
          ))}
        </SheetContent>
      </Sheet>
      <Dialog open={!!info} onOpenChange={(open) => !open && setInfo('')}>
        <DialogContent className="info-dialog">
          <DialogTitle>{info}</DialogTitle>
          <DialogDescription>
            {info === 'Size guide'
              ? 'Find your fit. Garment chest widths and lengths in inches, measured flat.'
              : info === 'Shipping & returns'
                ? 'A little more about how our fictional store works.'
                : 'Independent spirit. Everyday uniform.'}
          </DialogDescription>
          {info === 'Size guide' ? (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest</th>
                    <th>Length</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['XS', '21', '26'],
                    ['S', '22', '27'],
                    ['M', '23', '28'],
                    ['L', '24', '29'],
                    ['XL', '25', '30'],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((v, i) => (
                        <td key={i}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                Bottoms waist: S (28–30), M (31–33), L (34–36), XL (37–39).
                Accessories are one size. Apparel uses a relaxed, unisex fit.
                These are sample measurements.
              </p>
            </>
          ) : info === 'Shipping & returns' ? (
            <>
              <p>
                Standard US shipping: $8, complimentary on orders $180+.
                Express: $18. Estimated delivery: 4–7 business days standard,
                2–3 express.
              </p>
              <p>
                Our sample policy allows returns of unworn pieces within 30
                days. This is a fictional store: demo orders are not paid,
                fulfilled, or shipped.
              </p>
            </>
          ) : (
            <p>
              FORM / AFTER is a fictional independent streetwear studio. Our
              first collection explores the everyday uniform through heavyweight
              fabrics, easy proportions, and a restrained palette. Built for the
              space between plans. Product photography is illustrative;
              specifications and prices are fictional.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
