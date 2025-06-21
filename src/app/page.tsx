import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              🚀 Powered by BrightData & Real-time Analytics
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Dayton&apos;s Premier
              <span className="text-primary block">Business Directory</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with local businesses, generate leads, and grow your presence in the Dayton area with our intelligent platform.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/directory">Browse Businesses</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/register">List Your Business</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced features designed for modern businesses and customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Real-time Lead Routing</CardTitle>
              <CardDescription>
                Intelligent lead distribution ensures businesses never miss an opportunity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Automatic priority assignment</li>
                <li>• Instant notifications</li>
                <li>• Smart routing algorithms</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Business Analytics</CardTitle>
              <CardDescription>
                Comprehensive dashboards with actionable insights for growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Lead conversion tracking</li>
                <li>• Performance metrics</li>
                <li>• Market analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>BrightData Integration</CardTitle>
              <CardDescription>
                Automated business data collection and competitor analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Market research automation</li>
                <li>• Competitor insights</li>
                <li>• Data enrichment</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Local Businesses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10k+</div>
              <div className="text-muted-foreground">Leads Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Real-time Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Popular Categories</h2>
          <p className="text-muted-foreground">
            Discover businesses across Dayton&apos;s most popular industries
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Restaurants', icon: '🍽️', count: '120+' },
            { name: 'Healthcare', icon: '🏥', count: '85+' },
            { name: 'Services', icon: '🔧', count: '150+' },
            { name: 'Retail', icon: '🛍️', count: '200+' },
            { name: 'Automotive', icon: '🚗', count: '60+' },
            { name: 'Real Estate', icon: '🏠', count: '75+' },
            { name: 'Fitness', icon: '💪', count: '45+' },
            { name: 'Beauty', icon: '💄', count: '90+' },
          ].map((category) => (
            <Link 
              key={category.name}
              href={`/directory?category=${category.name.toUpperCase()}`}
              className="group"
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-semibold">{category.name}</div>
                  <div className="text-sm text-muted-foreground">{category.count}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Ready to Grow Your Business?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join hundreds of Dayton businesses already using our platform to connect with customers and grow their revenue.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/auth/register">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
