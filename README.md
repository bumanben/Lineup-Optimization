# Lineup-Optimization
A project within the Sports Analytics Research Group of Johns Hopkins University 

Most baseball stats evaluate players in isolation, but baseball isn’t played in isolation. We created a new stat, BRP (Baserunner-Dependent Run Production), that evaluates how groups of four players interact to generate runs, capturing the dynamics of real lineups far better than traditional metrics.

This approach reveals a major oversight in modern lineup analysis: the order of hitters significantly affects run production, not just due to individual talent, but due to how their skills complement each other. By modeling every possible batting order, all 362,880 permutations, we identify the most effective lineup based on expected runs per cycle.

This stat powers our optimizer and is the foundation of our innovation. We have found that we can add 3–25% expected runs per cycle to every MLB lineup purely by reordering their players.

On the site, you can generate and compare optimized lineups. If your team’s current lineup has a net RPC of -0.10 and the optimized one shows +0.15, this suggests a potential ~25% improvement in run production per cycle purely by reordering the same players.

Our model assumes neutral park effects, consistent pitcher quality, and independence between plate appearances. While real-world outcomes involve more complexity, BRP focuses on isolating and quantifying inter-player synergy.
